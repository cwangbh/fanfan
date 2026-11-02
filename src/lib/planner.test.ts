import { describe, expect, it } from 'vitest'
import { DEFAULT_PEOPLE, dailyTargets, householdTargets } from './nutrition.ts'
import {
  BOX_DAYS,
  buildCatalog,
  computeWeek,
  deadline,
  freshIds,
  generatePlan,
  MIN_PROTEIN_FAMILIES,
  MIN_VEG_TYPES,
  mainProtein,
  recentRecipeIds,
  swapOptions,
  weekStartOf,
} from './planner.ts'

const cat = buildCatalog()
const people = DEFAULT_PEOPLE

describe('nutrition (R1)', () => {
  it('matches the README table for the example people', () => {
    const [her, him] = people.map(dailyTargets)
    expect(her).toEqual({ kcal: 1730, protein: 66, veg: 450, fruit: 200 })
    expect(him).toEqual({ kcal: 2270, protein: 84, veg: 500, fruit: 300 })
    const ht = householdTargets(people)
    expect(ht.week.protein).toBe(1050)
    expect(ht.week.veg).toBe(6650)
    expect(ht.week.fruit).toBe(3500)
    expect(ht.weekProteinFromFoods).toBe(683)
  })
})

describe('planner (R2, R4, R5)', () => {
  const seeds = [1, 2, 3, 42, 99, 123, 777, 2024, 31337, 65535]

  for (const seed of seeds) {
    it(`seed ${seed}: follows every weekly rule`, () => {
      const plan = generatePlan({ catalog: cat, weekStart: '2026-11-01', seed })
      const view = computeWeek(plan, cat, people)

      // R4: 6 mains, 6 veg dishes, 2 soups, 1 one-pot, no repeats
      const count = (k: string) => plan.slots.filter((s) => s.slot === k).length
      expect([count('main'), count('veg'), count('soup'), count('onepot')]).toEqual([6, 6, 2, 1])
      expect(new Set(plan.slots.map((s) => s.recipeId)).size).toBe(15)

      // R2: dinner on Sun–Thu + Sat, nothing on Friday, one-pot on Saturday
      for (const day of [0, 1, 2, 3, 4, 6]) {
        expect(plan.slots.some((s) => s.day === day && s.slot === 'main')).toBe(true)
        expect(plan.slots.some((s) => s.day === day && s.slot === 'veg')).toBe(true)
      }
      expect(plan.slots.filter((s) => s.day === 5)).toEqual([])
      expect(plan.slots.find((s) => s.slot === 'onepot')!.day).toBe(6)
      expect(view.boxes).toHaveLength(BOX_DAYS.length * 2)
      expect(view.boxes.map((b) => b.eatDay)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])

      // R4: every fresh ingredient appears in 2+ dishes; ≥4 protein families, ≤2 mains each; variety
      expect(view.warnings).toEqual([])
      const veg = new Set(plan.slots.flatMap((s) => freshIds(cat.byId[s.recipeId], cat)).filter((id) => cat.ingredients[id].category === 'veg' && !cat.ingredients[id].notVeg))
      expect(veg.size).toBeGreaterThanOrEqual(MIN_VEG_TYPES)
      expect([...veg].some((id) => cat.ingredients[id].leafy)).toBe(true)
      const proteins = plan.slots.filter((s) => s.slot === 'main').map((s) => mainProtein(cat.byId[s.recipeId], cat))
      expect(new Set(proteins).size).toBeGreaterThanOrEqual(MIN_PROTEIN_FAMILIES)
      for (const p of new Set(proteins)) expect(proteins.filter((x) => x === p).length).toBeLessThanOrEqual(2)

      // R5: nothing cooked after its cook-by day; fish by Mon, leafy greens by Tue
      for (const s of plan.slots) {
        const r = cat.byId[s.recipeId]
        expect(deadline(r, cat)).toBeGreaterThanOrEqual(s.day)
        if ('fish' in r.items) expect(s.day).toBeLessThanOrEqual(1)
        if ('spinach' in r.items || 'bok_choy' in r.items) expect(s.day).toBeLessThanOrEqual(2)
      }

      // R3: totals within ±10% of the planned-meal targets
      for (const k of ['proteinFoods', 'veg', 'fruit'] as const) {
        expect(Math.abs(view.totals[k] / view.targets[k] - 1)).toBeLessThan(0.1)
      }
    })
  }

  it('is deterministic for a seed', () => {
    const a = generatePlan({ catalog: cat, weekStart: '2026-11-01', seed: 5 })
    const b = generatePlan({ catalog: cat, weekStart: '2026-11-01', seed: 5 })
    expect(a).toEqual(b)
  })

  it('splits portions by protein target (about 44/56 for the example people)', () => {
    const view = computeWeek(generatePlan({ catalog: cat, weekStart: '2026-11-01', seed: 1 }), cat, people)
    expect(view.shares[0]).toBeCloseTo(0.44, 2)
    const box = view.boxes.filter((b) => b.eatDay === 1)
    expect(box[0].items[0].g).toBeLessThan(box[1].items[0].g)
  })

  it('avoids recently cooked dishes', () => {
    const w1 = generatePlan({ catalog: cat, weekStart: '2026-10-25', seed: 7 })
    const recent = recentRecipeIds([w1], '2026-11-01')
    expect(recent.size).toBe(15)
    const w2 = generatePlan({ catalog: cat, weekStart: '2026-11-01', seed: 8, recent })
    const repeats = w2.slots.filter((s) => recent.has(s.recipeId)).length
    expect(repeats).toBeLessThan(8)
  })

  it('never offers hidden recipes, and uses favourites', () => {
    const hidden = buildCatalog([], { kung_pao_chicken: { hidden: true } })
    for (const seed of [1, 2, 3]) {
      const plan = generatePlan({ catalog: hidden, weekStart: '2026-11-01', seed })
      expect(plan.slots.map((s) => s.recipeId)).not.toContain('kung_pao_chicken')
    }
  })

  it('plans with a custom recipe and custom ingredient', () => {
    const custom = buildCatalog(
      [{ id: 'u_lamb', name: 'Cumin lamb', kind: 'main', cuisine: 'Chinese', minutes: 20, items: { lamb: 250, onion: 150 }, steps: [] }],
      { u_lamb: {} },
      [{ id: 'lamb', name: 'Lamb', category: 'protein', protein: 20, useBy: 6, freezable: true, storage: 'Freeze.' }],
    )
    expect(freshIds(custom.byId.u_lamb, custom)).toEqual(['lamb', 'onion'])
    const plan = generatePlan({ catalog: custom, weekStart: '2026-11-01', seed: 1 })
    expect(computeWeek(plan, custom, people).dishes.length).toBe(15)
  })

  it('swap options keep the same kind and respect cook-by days', () => {
    const plan = generatePlan({ catalog: cat, weekStart: '2026-11-01', seed: 1 })
    const idx = plan.slots.findIndex((s) => s.slot === 'main' && s.day === 6)
    const opts = swapOptions(plan, idx, cat)
    expect(opts.length).toBeGreaterThan(0)
    for (const o of opts) {
      expect(o.recipe.kind).toBe('main')
      expect(deadline(o.recipe, cat)).toBe(6)
    }
  })

  it('weeks start on Sunday', () => {
    expect(weekStartOf(new Date(2026, 10, 2))).toBe('2026-11-01') // Mon
    expect(weekStartOf(new Date(2026, 10, 1))).toBe('2026-11-01') // Sun
    expect(weekStartOf(new Date(2026, 10, 7))).toBe('2026-11-01') // Sat
  })
})
