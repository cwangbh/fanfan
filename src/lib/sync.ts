// Shared by the browser store and the server: record shape, validation and merge rules (README R10).

export const COLLECTIONS = ['profile', 'recipes', 'ingredients', 'weeks', 'checks'] as const
export type Collection = (typeof COLLECTIONS)[number]

export interface Rec {
  collection: Collection
  key: string
  data: unknown
  /** Client clock, ms. Last write wins per record. */
  updatedAt: number
  deleted?: boolean
}

export const recId = (r: Pick<Rec, 'collection' | 'key'>) => `${r.collection}/${r.key}`

/** At least 128 bits of randomness, URL-safe. */
export const HOUSEHOLD_RE = /^[A-Za-z0-9_-]{22,64}$/

export function newHouseholdId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18))
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Accepts a full household link, a `#h=` hash, or the bare id. */
export function parseHouseholdInput(input: string): string | null {
  const s = input.trim()
  const m = s.match(/[#&?]h=([A-Za-z0-9_-]+)/)
  const id = m ? m[1] : s
  return HOUSEHOLD_RE.test(id) ? id : null
}

const MAX_KEY = 200
const MAX_DATA = 200_000

export function validateRecord(r: unknown): Rec | null {
  if (!r || typeof r !== 'object') return null
  const o = r as Record<string, unknown>
  if (!COLLECTIONS.includes(o.collection as Collection)) return null
  if (typeof o.key !== 'string' || !o.key || o.key.length > MAX_KEY) return null
  if (typeof o.updatedAt !== 'number' || !Number.isFinite(o.updatedAt)) return null
  if (o.deleted !== undefined && typeof o.deleted !== 'boolean') return null
  if (JSON.stringify(o.data ?? null).length > MAX_DATA) return null
  return { collection: o.collection as Collection, key: o.key, data: o.data ?? null, updatedAt: o.updatedAt, deleted: o.deleted === true }
}

/** True when `incoming` should replace `current` (strictly newer wins; ties keep what is there). */
export const isNewer = (incoming: Rec, current: Rec | undefined) => !current || incoming.updatedAt > current.updatedAt

/** Merge incoming records into a local map. Returns the new map and whether anything changed. */
export function mergeRecords(local: Record<string, Rec>, incoming: Rec[]) {
  let changed = false
  const merged = { ...local }
  for (const r of incoming) {
    const id = recId(r)
    if (isNewer(r, merged[id])) {
      merged[id] = r
      changed = true
    }
  }
  return { merged, changed }
}

/** A timestamp guaranteed to beat the record it replaces, even if this phone's clock is behind. */
export const nextTimestamp = (prev: Rec | undefined, now = Date.now()) => Math.max(now, (prev?.updatedAt ?? 0) + 1)

// ---------- Export / import (iCloud backup) ----------

export const EXPORT_APP = 'fanfan'
/** Backups made before the app was renamed. */
const LEGACY_EXPORT_APPS = ['weekly-meal-prep']

export interface ExportFile {
  app: typeof EXPORT_APP
  version: 1
  exportedAt: string
  household: string
  records: Rec[]
}

export function makeExport(household: string, records: Rec[]): ExportFile {
  return { app: EXPORT_APP, version: 1, exportedAt: new Date().toISOString(), household, records: records.filter((r) => !r.deleted) }
}

export function parseExport(text: string): ExportFile {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('This file is not valid JSON.')
  }
  const o = json as Partial<ExportFile>
  const app = o?.app as string | undefined
  if ((app !== EXPORT_APP && !LEGACY_EXPORT_APPS.includes(app ?? '')) || o.version !== 1 || !Array.isArray(o.records)) {
    throw new Error('This is not a Fanfan backup file.')
  }
  const records = o.records.map(validateRecord)
  if (records.some((r) => !r)) throw new Error('The backup file contains damaged records.')
  return { ...(o as ExportFile), app: EXPORT_APP, records: records as Rec[] }
}

/**
 * Records to write so the household matches the backup exactly: every backup record
 * re-stamped as newest, and a deletion for every local record the backup doesn't have.
 */
export function importChanges(local: Record<string, Rec>, file: ExportFile, now = Date.now()): Rec[] {
  const ids = new Set(file.records.map(recId))
  const restored = file.records.map((r) => ({ ...r, deleted: false, updatedAt: nextTimestamp(local[recId(r)], now) }))
  const removed = Object.values(local)
    .filter((r) => !r.deleted && !ids.has(recId(r)))
    .map((r) => ({ ...r, data: null, deleted: true, updatedAt: nextTimestamp(r, now) }))
  return [...restored, ...removed]
}
