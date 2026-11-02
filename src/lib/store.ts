// Offline-first local copy of the household data, synced with the server (README R10).
import { useSyncExternalStore } from 'react'
import { get as idbGet, set as idbSet } from 'idb-keyval'
import {
  importChanges,
  makeExport,
  mergeRecords,
  newHouseholdId,
  nextTimestamp,
  parseExport,
  parseHouseholdInput,
  recId,
  type Collection,
  type ExportFile,
  type Rec,
} from './sync.ts'

const IDB_KEY = 'fanfan-state'
const POLL_MS = 10_000
const PUSH_BATCH = 500

interface Persisted {
  household: string | null
  records: Record<string, Rec>
  /** Record ids changed locally and not yet accepted by the server. */
  pending: string[]
  cursor: number
  lastSync: number | null
}

export interface SyncStatus {
  online: boolean
  syncing: boolean
  lastSync: number | null
  pending: number
  error: string | null
}

export interface Snapshot {
  ready: boolean
  household: string | null
  records: Record<string, Rec>
  status: SyncStatus
}

let state: Persisted = { household: null, records: {}, pending: [], cursor: 0, lastSync: null }
let ready = false
let syncing = false
let error: string | null = null
let snapshot: Snapshot = makeSnapshot()
const listeners = new Set<() => void>()

function makeSnapshot(): Snapshot {
  return {
    ready,
    household: state.household,
    records: state.records,
    status: {
      online: typeof navigator === 'undefined' ? true : navigator.onLine,
      syncing,
      lastSync: state.lastSync,
      pending: state.pending.length,
      error,
    },
  }
}

function emit() {
  snapshot = makeSnapshot()
  for (const l of listeners) l()
}

let saveTimer: ReturnType<typeof setTimeout> | undefined
function persist() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    idbSet(IDB_KEY, state).catch((e) => console.error('Could not save locally', e))
  }, 150)
}

function update(next: Partial<Persisted>) {
  state = { ...state, ...next }
  persist()
  emit()
}

// ---------- Household ----------

function setHash(id: string | null) {
  const url = new URL(location.href)
  url.hash = id ? `h=${id}` : ''
  history.replaceState(null, '', url)
}

export function householdLink(id: string) {
  const url = new URL(location.href)
  url.search = ''
  url.hash = `h=${id}`
  return url.toString()
}

function switchHousehold(id: string | null) {
  state = { household: id, records: {}, pending: [], cursor: 0, lastSync: null }
  error = null
  setHash(id)
  persist()
  emit()
  if (id) void syncNow()
}

export const createHousehold = () => switchHousehold(newHouseholdId())
export const joinHousehold = (id: string) => switchHousehold(id)
export const leaveHousehold = () => switchHousehold(null)

// ---------- Writes ----------

export function put(collection: Collection, key: string, data: unknown) {
  write([{ collection, key, data, deleted: false }])
}

export function remove(collection: Collection, key: string) {
  write([{ collection, key, data: null, deleted: true }])
}

function write(changes: Omit<Rec, 'updatedAt'>[]) {
  const records = { ...state.records }
  const pending = new Set(state.pending)
  for (const c of changes) {
    const id = recId(c)
    records[id] = { ...c, updatedAt: nextTimestamp(records[id]) }
    pending.add(id)
  }
  update({ records, pending: [...pending] })
  schedulePush()
}

let pushTimer: ReturnType<typeof setTimeout> | undefined
function schedulePush() {
  clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void syncNow(), 300)
}

// ---------- Sync ----------

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`api/households/${state.household}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Server replied ${res.status}`)
  return res.json() as Promise<T>
}

export async function syncNow(): Promise<void> {
  if (!state.household || syncing) return
  if (!navigator.onLine) {
    emit()
    return
  }
  syncing = true
  emit()
  const household = state.household
  try {
    // Push local changes.
    while (state.pending.length && state.household === household) {
      const batchIds = state.pending.slice(0, PUSH_BATCH)
      const sent = batchIds.map((id) => state.records[id]).filter(Boolean)
      await api('/changes', { method: 'POST', body: JSON.stringify({ records: sent }) })
      // Only clear ids not changed again while the request was in flight.
      const sentAt = new Map(sent.map((r) => [recId(r), r.updatedAt]))
      update({ pending: state.pending.filter((id) => !(sentAt.has(id) && state.records[id]?.updatedAt === sentAt.get(id))) })
    }
    // Pull remote changes.
    let more = true
    while (more && state.household === household) {
      const page = await api<{ records: Rec[]; cursor: number; more: boolean }>(`/changes?since=${state.cursor}`)
      const { merged, changed } = mergeRecords(state.records, page.records)
      update({ cursor: page.cursor, ...(changed ? { records: merged } : {}) })
      more = page.more
    }
    error = null
    update({ lastSync: Date.now() })
  } catch (e) {
    error = navigator.onLine ? (e as Error).message : null
  } finally {
    syncing = false
    emit()
  }
}

// ---------- Export / import ----------

export function exportFile(): ExportFile {
  return makeExport(state.household ?? '', Object.values(state.records))
}

export function importFile(text: string): number {
  const file = parseExport(text)
  const changes = importChanges(state.records, file)
  const { merged } = mergeRecords(state.records, changes)
  update({ records: merged, pending: [...new Set([...state.pending, ...changes.map(recId)])] })
  schedulePush()
  return file.records.length
}

// ---------- Startup ----------

export async function initStore() {
  try {
    const saved = await idbGet<Persisted>(IDB_KEY)
    if (saved) state = saved
  } catch (e) {
    console.error('Could not read local data', e)
  }
  const fromHash = parseHouseholdInput(location.hash)
  if (fromHash && fromHash !== state.household) {
    ready = true
    switchHousehold(fromHash)
  } else {
    if (state.household) setHash(state.household)
    ready = true
    emit()
  }

  void syncNow()
  setInterval(() => {
    if (document.visibilityState === 'visible') void syncNow()
  }, POLL_MS)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void syncNow()
  })
  window.addEventListener('online', () => void syncNow())
  window.addEventListener('offline', emit)
  window.addEventListener('hashchange', () => {
    const h = parseHouseholdInput(location.hash)
    if (h && h !== state.household) switchHousehold(h)
  })
}

export function useStore(): Snapshot {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => snapshot,
  )
}

/** Live (not deleted) records of one collection, as key → data. */
export function selectCollection<T>(records: Record<string, Rec>, collection: Collection): Record<string, T> {
  const out: Record<string, T> = {}
  const prefix = `${collection}/`
  for (const [id, r] of Object.entries(records)) {
    if (id.startsWith(prefix) && !r.deleted) out[r.key] = r.data as T
  }
  return out
}
