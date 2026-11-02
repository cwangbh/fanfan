import { describe, expect, it } from 'vitest'
import {
  importChanges,
  makeExport,
  mergeRecords,
  newHouseholdId,
  nextTimestamp,
  parseExport,
  parseHouseholdInput,
  recId,
  validateRecord,
  type Rec,
} from './sync.ts'

const rec = (key: string, updatedAt: number, data: unknown = true, collection: Rec['collection'] = 'checks'): Rec => ({
  collection,
  key,
  data,
  updatedAt,
  deleted: false,
})
const toMap = (rs: Rec[]) => Object.fromEntries(rs.map((r) => [recId(r), r]))

describe('sync (R10)', () => {
  it('household ids are long enough and parse from links', () => {
    const id = newHouseholdId()
    expect(id).toMatch(/^[A-Za-z0-9_-]{24}$/)
    expect(parseHouseholdInput(`https://meals.example.com/#h=${id}`)).toBe(id)
    expect(parseHouseholdInput(`#h=${id}`)).toBe(id)
    expect(parseHouseholdInput(id)).toBe(id)
    expect(parseHouseholdInput('short')).toBeNull()
  })

  it('last write wins per record; ticks on different items are all kept', () => {
    const local = toMap([rec('w:ing:eggs', 100), rec('w:ing:beef', 100)])
    const { merged } = mergeRecords(local, [rec('w:ing:eggs', 200, false), rec('w:ing:beef', 50, false), rec('w:ing:tofu', 150)])
    expect(merged['checks/w:ing:eggs'].data).toBe(false) // newer remote wins
    expect(merged['checks/w:ing:beef'].data).toBe(true) // older remote ignored
    expect(merged['checks/w:ing:tofu'].data).toBe(true) // new remote kept
  })

  it('two offline phones converge after exchanging changes', () => {
    const a = toMap([rec('x', 1)])
    const b = toMap([rec('x', 1)])
    const fromA = [rec('x', 10, 'A'), rec('a-only', 11)]
    const fromB = [rec('x', 12, 'B'), rec('b-only', 9)]
    const a2 = mergeRecords({ ...a, ...toMap(fromA) }, fromB).merged
    const b2 = mergeRecords({ ...b, ...toMap(fromB) }, fromA).merged
    expect(a2).toEqual(b2)
    expect(a2['checks/x'].data).toBe('B')
  })

  it('a new write always beats the record it replaces, even with a slow clock', () => {
    expect(nextTimestamp(rec('x', 5000), 1000)).toBe(5001)
    expect(nextTimestamp(undefined, 1000)).toBe(1000)
  })

  it('rejects bad records', () => {
    expect(validateRecord({ collection: 'nope', key: 'x', updatedAt: 1 })).toBeNull()
    expect(validateRecord({ collection: 'checks', key: '', updatedAt: 1 })).toBeNull()
    expect(validateRecord({ collection: 'checks', key: 'x', updatedAt: 'soon' })).toBeNull()
    expect(validateRecord({ collection: 'checks', key: 'x', updatedAt: 1, data: 'x'.repeat(300_000) })).toBeNull()
    expect(validateRecord({ collection: 'checks', key: 'x', updatedAt: 1, data: 1 })).toEqual(rec('x', 1, 1))
  })

  it('export → wipe → import restores the same data', () => {
    const original = [rec('people', 5, { a: 1 }, 'profile'), rec('u_lamb', 6, { name: 'Lamb' }, 'recipes'), rec('w:ing:eggs', 7)]
    const file = parseExport(JSON.stringify(makeExport('h', original)))
    // Local data changed after the export: one record edited, one added.
    const local = toMap([rec('people', 50, { a: 2 }, 'profile'), rec('extra', 60)])
    const changes = importChanges(local, file, 100)
    const after = mergeRecords(local, changes).merged
    const live = Object.values(after).filter((r) => !r.deleted)
    expect(live.map((r) => [recId(r), r.data]).sort()).toEqual(original.map((r) => [recId(r), r.data]).sort())
    expect(after['checks/extra'].deleted).toBe(true)
  })

  it('still imports backups made under the old app name', () => {
    const old = JSON.stringify({ ...makeExport('h', [rec('a', 1)]), app: 'weekly-meal-prep' })
    expect(parseExport(old).records).toHaveLength(1)
  })

  it('rejects files that are not backups', () => {
    expect(() => parseExport('{')).toThrow(/not valid JSON/)
    expect(() => parseExport('{"app":"other"}')).toThrow(/not a Fanfan backup/)
  })
})
