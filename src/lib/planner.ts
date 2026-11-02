import { FRUITS, FRUIT_BY_ID, INGREDIENTS, type Ingredient } from '../data/ingredients.ts'
import { RECIPES, type DishKind, type Recipe } from '../data/recipes.ts'
import { householdTargets, type Person } from './nutrition.ts'

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
/** Nights with a full dinner (main + veg). Friday is takeout. */
export const COOK_DAYS = [0, 1, 2, 3, 4, 6]
/** Nights whose dinner is cooked double so the leftovers fill the next day's lunch boxes. */
export const BOX_DAYS = [0, 1, 2, 3, 4]
const SOUP_DAYS = [1, 3]
export const ONEPOT_DAY = 6
/** The plan covers 12 of the week's 14 lunches and dinners (no Sunday lunch, Friday is takeout). */
export const PLANNED_MEAL_SHARE = 12 / 14
/** Rough raw → cooked weight factor, used for portion guides. */
const COOKED_FACTOR = 0.85
const STARCHES = new Set(['rice', 'noodles', 'pasta'])

export const KIND_LABELS: Record<DishKind, string> = {
  main: 'Main',
  veg: 'Vegetable dish',
  soup: 'Soup',
  onepot: 'Saturday one-pot',
}

// ---------- Catalog ----------

export interface CatalogRecipe extends Recipe {
  favourite?: boolean
  hidden?: boolean
  custom?: boolean
}

export interface RecipeFlags {
  favourite?: boolean
  hidden?: boolean
}

export interface Catalog {
  recipes: CatalogRecipe[]
  byId: Record<string, CatalogRecipe>
  ingredients: Record<string, Ingredient>
}

export function buildCatalog(
  custom: CatalogRecipe[] = [],
  flags: Record<string, RecipeFlags> = {},
  customIngredients: Ingredient[] = [],
): Catalog {
  const recipes: CatalogRecipe[] = [
    ...RECIPES.map((r) => ({ ...r, ...flags[r.id] })),
    ...custom.map((r) => ({ ...r, custom: true })),
  ]
  return {
    recipes,
    byId: Object.fromEntries(recipes.map((r) => [r.id, r])),
    ingredients: { ...INGREDIENTS, ...Object.fromEntries(customIngredients.map((i) => [i.id, i])) },
  }
}

const isFresh = (ing: Ingredient | undefined) => !!ing && (ing.category === 'protein' || ing.category === 'veg')

export function freshIds(r: Recipe, cat: Catalog): string[] {
  return Object.keys(r.items).filter((id) => isFresh(cat.ingredients[id]))
}

/** Last day the dish can be cooked, from its most perishable fresh ingredient. */
export function deadline(r: Recipe, cat: Catalog): number {
  return freshIds(r, cat).reduce((d, id) => Math.min(d, cat.ingredients[id].useBy), 6)
}

/** Family of the protein ingredient with the most grams (chicken, pork, beef, seafood, eggs, tofu…), used for variety rules. */
export function mainProtein(r: Recipe, cat: Catalog): string | undefined {
  let best: string | undefined
  for (const [id, g] of Object.entries(r.items)) {
    if (cat.ingredients[id]?.category === 'protein' && (!best || g > r.items[best])) best = id
  }
  return best && (cat.ingredients[best].family ?? best)
}

/** Variety minimums for one week. */
export const MIN_PROTEIN_FAMILIES = 4
export const MIN_VEG_TYPES = 8

// ---------- Plan ----------

export type Slot = DishKind
export interface PlanSlot {
  day: number
  slot: Slot
  recipeId: string
}
export interface FruitSlot {
  fruitId: string
  days: number[]
}
export interface WeekPlan {
  weekStart: string
  seed: number
  slots: PlanSlot[]
  fruit: FruitSlot[]
}

export function batchSize(s: PlanSlot): number {
  return (s.slot === 'main' || s.slot === 'veg') && BOX_DAYS.includes(s.day) ? 2 : 1
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NEEDED: [Slot, number][] = [['main', 6], ['veg', 6], ['soup', 2], ['onepot', 1]]

type Selection = Record<Slot, string[]>

interface Ctx {
  cat: Catalog
  recent: Set<string>
  pools: Record<Slot, CatalogRecipe[]>
  /** Random tie-break per recipe, so equal-deadline dishes land on varied days. */
  tie: Map<string, number>
}

interface Scored {
  sel: Selection
  slots: PlanSlot[]
  penalty: number
}

/** Earliest-deadline-first: the most perishable dish goes on the earliest day. */
function scheduleKind(ids: string[], days: number[], ctx: Ctx, slot: Slot) {
  const order = ids
    .map((id) => ({ id, d: deadline(ctx.cat.byId[id], ctx.cat), t: ctx.tie.get(id) ?? 0 }))
    .sort((a, b) => a.d - b.d || a.t - b.t)
  let late = 0
  const slots = order.map((o, i) => {
    let day = days[i]
    if (slot === 'soup' && o.d < day) day = o.d
    if (o.d < day) late++
    return { day, slot, recipeId: o.id }
  })
  return { slots, late }
}

function evaluate(sel: Selection, ctx: Ctx): Scored {
  const { cat, recent } = ctx
  const mains = scheduleKind(sel.main, COOK_DAYS, ctx, 'main')
  const vegs = scheduleKind(sel.veg, COOK_DAYS, ctx, 'veg')
  const soups = scheduleKind(sel.soup, SOUP_DAYS, ctx, 'soup')
  const onepot = scheduleKind(sel.onepot, [ONEPOT_DAY], ctx, 'onepot')

  const all = [...sel.main, ...sel.veg, ...sel.soup, ...sel.onepot]
  const used = new Map<string, number>()
  for (const id of all) for (const f of freshIds(cat.byId[id], cat)) used.set(f, (used.get(f) ?? 0) + 1)
  const proteinUse = new Map<string, number>()
  for (const id of sel.main) {
    const mp = mainProtein(cat.byId[id], cat)
    if (mp) proteinUse.set(mp, (proteinUse.get(mp) ?? 0) + 1)
  }
  const late = mains.late + vegs.late + soups.late + onepot.late
  const singles = [...used.values()].filter((n) => n < 2).length
  const overUsed = [...proteinUse.values()].reduce((s, n) => s + Math.max(0, n - 2), 0)
  const veg = [...used.keys()].filter((id) => cat.ingredients[id].category === 'veg' && !cat.ingredients[id].notVeg)
  const leafy = veg.some((id) => cat.ingredients[id].leafy)
  const penalty =
    late * 1000 +
    (singles + overUsed + Math.max(0, MIN_PROTEIN_FAMILIES - proteinUse.size)) * 100 +
    Math.max(0, MIN_VEG_TYPES - veg.length) * 40 +
    (leafy ? 0 : 60) +
    used.size +
    all.filter((id) => recent.has(id)).length * 3 -
    all.filter((id) => cat.byId[id].favourite).length * 2
  return { sel, slots: [...mains.slots, ...vegs.slots, ...soups.slots, ...onepot.slots], penalty }
}

/** Greedy pick that prefers dishes sharing ingredients already in the basket. */
function greedy(ctx: Ctx, rng: () => number): Selection | null {
  const { cat, recent, pools } = ctx
  const chosen = new Set<string>()
  const used = new Set<string>()
  const proteinUse = new Map<string, number>()
  const sel: Selection = { main: [], veg: [], soup: [], onepot: [] }

  const order: Slot[] = []
  for (let i = 0; i < 6; i++) order.push('main', 'veg')
  order.push('soup', 'soup', 'onepot')

  for (const kind of order) {
    const vegTypes = [...used].filter((id) => cat.ingredients[id].category === 'veg' && !cat.ingredients[id].notVeg).length
    const hasLeafy = [...used].some((id) => cat.ingredients[id].leafy)
    let best: CatalogRecipe | undefined
    let bestScore = -Infinity
    for (const r of pools[kind]) {
      if (chosen.has(r.id)) continue
      const mp = kind === 'main' ? mainProtein(r, cat) : undefined
      if (mp && (proteinUse.get(mp) ?? 0) >= 2) continue
      if (kind === 'onepot' && deadline(r, cat) < ONEPOT_DAY) continue
      const fresh = freshIds(r, cat)
      const overlap = fresh.filter((id) => used.has(id)).length
      // Until the week reaches the variety minimums, new vegetables and protein families are welcome.
      const newVeg = fresh.filter((id) => !used.has(id) && cat.ingredients[id].category === 'veg').length
      const vegBonus = vegTypes < MIN_VEG_TYPES ? newVeg * 3.5 : 0
      const familyBonus = mp && !proteinUse.has(mp) && proteinUse.size < MIN_PROTEIN_FAMILIES ? 4 : 0
      const leafyBonus = !hasLeafy && fresh.some((id) => cat.ingredients[id].leafy) ? 3 : 0
      const score =
        2 * overlap - 3 * (fresh.length - overlap) + vegBonus + familyBonus + leafyBonus +
        (r.favourite ? 1.5 : 0) - (recent.has(r.id) ? 3 : 0) + rng() * 3
      if (score > bestScore) {
        bestScore = score
        best = r
      }
    }
    if (!best) return null
    chosen.add(best.id)
    sel[kind].push(best.id)
    for (const id of freshIds(best, cat)) used.add(id)
    const mp = kind === 'main' ? mainProtein(best, cat) : undefined
    if (mp) proteinUse.set(mp, (proteinUse.get(mp) ?? 0) + 1)
  }
  return sel
}

/** Hill-climb: swap single dishes while that lowers the penalty. */
function improve(start: Scored, ctx: Ctx): Scored {
  let cur = start
  for (let pass = 0; pass < 4; pass++) {
    let better = false
    for (const [kind] of NEEDED) {
      for (let i = 0; i < cur.sel[kind].length; i++) {
        const inSel = new Set(Object.values(cur.sel).flat())
        for (const r of ctx.pools[kind]) {
          if (inSel.has(r.id)) continue
          const list = [...cur.sel[kind]]
          list[i] = r.id
          const next = evaluate({ ...cur.sel, [kind]: list }, ctx)
          if (next.penalty < cur.penalty) {
            cur = next
            better = true
            inSel.clear()
            for (const id of Object.values(cur.sel).flat()) inSel.add(id)
          }
        }
      }
    }
    if (!better) break
  }
  return cur
}

function planFruit(rng: () => number): FruitSlot[] {
  const windows = [[0, 1], [2, 3], [4, 5], [6]]
  const taken = new Set<string>()
  return windows.map((days) => {
    const last = days[days.length - 1]
    const options = FRUITS.filter((f) => f.useBy >= last && !taken.has(f.id))
    // Prefer the most perishable fruit that still fits, so long-lasting fruit is saved for the end of the week.
    const minUseBy = Math.min(...options.map((f) => f.useBy))
    const early = options.filter((f) => f.useBy <= minUseBy + 1)
    const pick = early[Math.floor(rng() * early.length)]
    taken.add(pick.id)
    return { fruitId: pick.id, days }
  })
}

export interface GenerateOptions {
  catalog: Catalog
  weekStart: string
  seed: number
  /** Recipe ids cooked in the previous 2 weeks. */
  recent?: Set<string>
  attempts?: number
}

export function generatePlan({ catalog, weekStart, seed, recent = new Set(), attempts = 200 }: GenerateOptions): WeekPlan {
  const rng = mulberry32(seed)
  const pools = Object.fromEntries(
    NEEDED.map(([k]) => [k, catalog.recipes.filter((r) => r.kind === k && !r.hidden)]),
  ) as Record<Slot, CatalogRecipe[]>
  const ctx: Ctx = { cat: catalog, recent, pools, tie: new Map(catalog.recipes.map((r) => [r.id, rng()])) }

  const found: Scored[] = []
  for (let i = 0; i < attempts; i++) {
    const sel = greedy(ctx, rng)
    if (sel) found.push(evaluate(sel, ctx))
  }
  if (!found.length) {
    throw new Error('Not enough recipes to fill a week. You need at least 6 mains, 6 vegetable dishes, 2 soups and 1 Saturday one-pot.')
  }
  found.sort((a, b) => a.penalty - b.penalty)
  const best = found
    .slice(0, 5)
    .map((f) => improve(f, ctx))
    .reduce((a, b) => (b.penalty < a.penalty ? b : a))
  const slots = best.slots.sort((a, b) => a.day - b.day || SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot])
  return { weekStart, seed, slots, fruit: planFruit(rng) }
}

const SLOT_ORDER: Record<Slot, number> = { onepot: 0, main: 1, veg: 2, soup: 3 }

// ---------- Computed week view ----------

export interface Amount {
  id: string
  g: number
}

export interface DishView extends PlanSlot {
  index: number
  recipe: CatalogRecipe
  batch: number
  /** Scaled grams for the whole batch. */
  items: Amount[]
  /** Estimated cooked grams of one meal for both people, split by person. */
  portion: number[]
}

export interface Box {
  eatDay: number
  person: number
  items: { name: string; g: number }[]
  riceG: number
  fruit?: { name: string; g: number }
}

export interface ShoppingItem {
  key: string
  name: string
  amount: string
  hint?: string
  usedIn: string[]
}

export interface ShoppingGroup {
  id: string
  title: string
  items: ShoppingItem[]
}

export interface ChecklistItem {
  id: string
  text: string
}

export interface PrepSection {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface ThawEntry {
  when: string
  text: string
}

export interface WeekView {
  dishes: DishView[]
  byDay: DishView[][]
  shares: number[]
  boxes: Box[]
  fruitByDay: ({ name: string; g: number[] } | undefined)[]
  targets: { proteinFoods: number; veg: number; fruit: number }
  totals: { proteinFoods: number; veg: number; fruit: number }
  shopping: ShoppingGroup[]
  prep: PrepSection[]
  thaw: ThawEntry[]
  freshCount: number
  warnings: string[]
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
export const round = (v: number, step = 10) => Math.round(v / step) * step
const roundUp = (v: number, step: number) => Math.ceil(v / step) * step

export function formatGrams(g: number): string {
  return g >= 1000 ? `${(g / 1000).toFixed(g % 1000 === 0 ? 0 : 2).replace(/0$/, '')} kg` : `${Math.round(g)} g`
}

function plural(n: number, each: { label: string; plural?: string }) {
  return `${n} ${n === 1 ? each.label : (each.plural ?? each.label + 's')}`
}

export function computeWeek(plan: WeekPlan, cat: Catalog, people: Person[]): WeekView {
  const warnings: string[] = []
  const ht = householdTargets(people)
  const proteinTotal = ht.perPerson.reduce((s, t) => s + t.protein, 0)
  const shares = ht.perPerson.map((t) => t.protein / proteinTotal)

  const raw = plan.slots.flatMap((s, index) => {
    const recipe = cat.byId[s.recipeId]
    if (!recipe) {
      warnings.push(`A recipe on ${DAY_NAMES[s.day]} no longer exists. Swap it for another dish.`)
      return []
    }
    return [{ ...s, index, recipe, batch: batchSize(s) }]
  })

  // Scale protein and vegetable amounts so the week hits the targets for the planned meals.
  let p = 0
  let v = 0
  for (const d of raw) {
    for (const [id, g] of Object.entries(d.recipe.items)) {
      const ing = cat.ingredients[id]
      if (ing?.category === 'protein') p += (g * d.batch * ing.protein) / 100
      if (ing?.category === 'veg' && !ing.notVeg) v += g * d.batch
    }
  }
  const targets = {
    proteinFoods: ht.weekProteinFromFoods * PLANNED_MEAL_SHARE,
    veg: ht.week.veg * PLANNED_MEAL_SHARE,
    fruit: ht.week.fruit,
  }
  const pScale = p ? clamp(targets.proteinFoods / p, 0.5, 2.5) : 1
  const vScale = v ? clamp(targets.veg / v, 0.5, 2.5) : 1

  const dishes: DishView[] = raw.map((d) => {
    const items = Object.entries(d.recipe.items).map(([id, g]) => {
      const ing = cat.ingredients[id]
      const k = ing?.category === 'protein' ? pScale : ing?.category === 'veg' && !ing.notVeg ? vScale : 1
      return { id, g: g * k * d.batch }
    })
    const cooked =
      items.reduce((s, it) => {
        const ing = cat.ingredients[it.id]
        return isFresh(ing) || STARCHES.has(it.id) ? s + it.g : s
      }, 0) * COOKED_FACTOR
    const meal = cooked / d.batch
    return { ...d, items, portion: shares.map((sh) => round(meal * sh)) }
  })

  const byDay: DishView[][] = DAY_NAMES.map((_, day) => dishes.filter((d) => d.day === day))

  // Fruit per day, split by each person's target.
  const fruitByDay: WeekView['fruitByDay'] = DAY_NAMES.map(() => undefined)
  let fruitTotal = 0
  const fruitGrams = new Map<string, number>()
  for (const f of plan.fruit) {
    const fruit = FRUIT_BY_ID[f.fruitId]
    if (!fruit) continue
    for (const day of f.days) {
      const g = ht.perPerson.map((t) => t.fruit)
      fruitByDay[day] = { name: fruit.name, g }
      const sum = g.reduce((a, b) => a + b, 0)
      fruitTotal += sum
      fruitGrams.set(fruit.id, (fruitGrams.get(fruit.id) ?? 0) + sum)
    }
  }

  // Lunch boxes: Mon–Fri, from the previous night's main and veg dish.
  const boxes: Box[] = []
  for (const cookDay of BOX_DAYS) {
    const eatDay = cookDay + 1
    const from = byDay[cookDay].filter((d) => d.slot === 'main' || d.slot === 'veg')
    people.forEach((_, person) => {
      const fruit = fruitByDay[eatDay]
      boxes.push({
        eatDay,
        person,
        items: from.map((d) => ({ name: d.recipe.name, g: d.portion[person] })),
        riceG: round(ht.perPerson[person].kcal / 10),
        fruit: fruit && { name: fruit.name, g: fruit.g[person] },
      })
    })
  }

  // Totals and reuse checks.
  const totals = { proteinFoods: p * pScale, veg: v * vScale, fruit: fruitTotal }
  const usage = new Map<string, { g: number; dishes: Set<string> }>()
  for (const d of dishes) {
    for (const it of d.items) {
      const u = usage.get(it.id) ?? { g: 0, dishes: new Set() }
      u.g += it.g
      u.dishes.add(d.recipe.name)
      usage.set(it.id, u)
    }
    for (const id of freshIds(d.recipe, cat)) {
      const ing = cat.ingredients[id]
      if (ing.useBy < d.day) {
        warnings.push(`${d.recipe.name} on ${DAY_NAMES[d.day]} uses ${ing.name.toLowerCase()}, which should be cooked by ${DAY_NAMES[ing.useBy]}.`)
      }
    }
  }
  let freshCount = 0
  for (const [id, u] of usage) {
    if (!isFresh(cat.ingredients[id])) continue
    freshCount++
    if (u.dishes.size < 2) warnings.push(`${cat.ingredients[id].name} is only used in ${[...u.dishes][0]}.`)
  }

  return {
    dishes,
    byDay,
    shares,
    boxes,
    fruitByDay,
    targets,
    totals,
    shopping: buildShopping(usage, fruitGrams, cat),
    ...buildPrep(dishes, usage, plan, cat),
    freshCount,
    warnings,
  }
}

function buildShopping(usage: Map<string, { g: number; dishes: Set<string> }>, fruitGrams: Map<string, number>, cat: Catalog): ShoppingGroup[] {
  const groups: ShoppingGroup[] = [
    { id: 'protein', title: 'Meat, fish & eggs', items: [] },
    { id: 'veg', title: 'Vegetables', items: [] },
    { id: 'fruit', title: 'Fruit', items: [] },
    { id: 'aromatic', title: 'Aromatics', items: [] },
    { id: 'pantry', title: 'Pantry check', items: [] },
  ]
  const group = (id: string) => groups.find((g) => g.id === id)!
  for (const [id, u] of usage) {
    const ing = cat.ingredients[id]
    if (!ing) continue
    const usedIn = [...u.dishes]
    const item: ShoppingItem = { key: `ing:${id}`, name: ing.name, amount: '', usedIn }
    if (ing.category === 'pantry') {
      item.amount = ''
    } else if (id === 'eggs') {
      item.amount = `${Math.ceil(u.g / 50)} eggs`
    } else if (ing.each && ing.each.g >= 400 && ing.category === 'protein') {
      const n = Math.ceil(u.g / ing.each.g)
      item.amount = plural(n, ing.each)
      item.hint = `≈ ${formatGrams(round(u.g))}`
    } else {
      const g = ing.category === 'aromatic' ? roundUp(u.g, 10) : roundUp(u.g, 50)
      item.amount = formatGrams(g)
      if (ing.each) item.hint = `~${plural(Math.max(1, Math.round(g / ing.each.g)), ing.each)}`
    }
    group(ing.category).items.push(item)
  }
  for (const [id, g] of fruitGrams) {
    const f = FRUIT_BY_ID[id]
    const total = roundUp(g, 50)
    group('fruit').items.push({
      key: `fruit:${id}`,
      name: f.name,
      amount: formatGrams(total),
      hint: `~${plural(Math.max(1, Math.round(total / f.each.g)), f.each)}`,
      usedIn: [],
    })
  }
  for (const g of groups) g.items.sort((a, b) => a.name.localeCompare(b.name))
  return groups.filter((g) => g.items.length)
}

function buildPrep(dishes: DishView[], usage: Map<string, { g: number; dishes: Set<string> }>, plan: WeekPlan, cat: Catalog) {
  const proteinItems: ChecklistItem[] = []
  const thaw: ThawEntry[] = []
  for (const d of [...dishes].sort((a, b) => a.day - b.day)) {
    for (const it of d.items) {
      const ing = cat.ingredients[it.id]
      if (ing?.category !== 'protein' || it.id === 'eggs' || it.id === 'tofu') continue
      const day = DAY_NAMES[d.day]
      const g = formatGrams(round(it.g))
      const id = `protein:${d.index}:${it.id}`
      const name = ing.name.toLowerCase()
      if (!ing.freezable) {
        proteinItems.push({ id, text: `Fridge: ${g} ${name} for ${day}, ${d.recipe.name}. Keep it in the coldest spot and cook by ${DAY_NAMES[ing.useBy]}.` })
      } else if (it.id === 'shrimp') {
        proteinItems.push({ id, text: `Freezer: ${g} frozen shrimp for ${day}, ${d.recipe.name}. Keep it frozen.` })
        thaw.push({ when: `${day}, before cooking`, text: `Thaw ${g} shrimp under cold running water for 10 minutes (${d.recipe.name}).` })
      } else if (d.day <= 1) {
        proteinItems.push({ id, text: `Fridge: ${g} ${name} for ${day}, ${d.recipe.name}. ${ing.storage}` })
      } else {
        proteinItems.push({ id, text: `Freeze: ${g} ${name} for ${day}, ${d.recipe.name}. Bag it flat and label it "${day}". ${ing.storage}` })
        thaw.push({ when: `${DAY_NAMES[d.day - 1]} night`, text: `Move ${day}'s ${ing.name.toLowerCase()} (${g}) from the freezer to the fridge.` })
      }
    }
  }

  const vegItems: ChecklistItem[] = []
  for (const [id] of usage) {
    const ing = cat.ingredients[id]
    if (ing?.category === 'veg' && ing.storage) vegItems.push({ id: `veg:${id}`, text: `${ing.name}: ${ing.storage}` })
  }
  for (const f of plan.fruit) {
    const fruit = FRUIT_BY_ID[f.fruitId]
    if (fruit) vegItems.push({ id: `fruit:${fruit.id}`, text: `${fruit.name} (${f.days.map((d) => DAY_NAMES[d]).join(', ')}): ${fruit.storage}` })
  }

  const has = (pred: (r: Recipe) => boolean) => dishes.some((d) => pred(d.recipe))
  const uses = (r: Recipe, ...ids: string[]) => ids.every((id) => id in r.items)
  const preCut = new Set<string>()
  for (const d of dishes) {
    if (d.day > 2) continue
    for (const id of freshIds(d.recipe, cat)) {
      const ing = cat.ingredients[id]
      if (ing.preCut) preCut.add(ing.name.toLowerCase())
    }
  }
  const batch: ChecklistItem[] = [
    { id: 'batch:rice', text: 'Cook a big pot of rice for Sun–Tue dinners and lunch boxes. Cool it fast and keep it in the fridge.' },
  ]
  if (preCut.size) batch.push({ id: 'batch:precut', text: `Wash and pre-cut ${[...preCut].join(', ')} for Sun–Tue. Store them in boxes lined with paper towel.` })
  if (dishes.filter((d) => uses(d.recipe, 'garlic', 'soy_sauce')).length >= 2) {
    batch.push({ id: 'batch:garlic_soy', text: 'Make garlic-soy sauce: 4 tbsp soy sauce, 1 tbsp vinegar, 1 tsp sugar, 3 minced garlic cloves. Keeps 1 week in a jar.' })
  }
  if (has((r) => uses(r, 'ginger', 'scallion'))) {
    batch.push({ id: 'batch:ginger_scallion', text: 'Make ginger-scallion oil: pour hot oil over minced ginger, scallion and salt. Use it on steamed dishes, noodles and rice.' })
  }
  batch.push({ id: 'batch:boxes', text: 'Set out 10 lunch boxes, 5 each, labelled Her / Him.' })

  const prep: PrepSection[] = [
    { id: 'protein', title: 'Portion the proteins', items: proteinItems },
    { id: 'veg', title: 'Store vegetables & fruit', items: vegItems },
    { id: 'batch', title: 'Batch tasks', items: batch },
  ].filter((s) => s.items.length)
  return { prep, thaw }
}

/** "4 eggs", "320 g" for one ingredient amount. */
export function formatItem(id: string, g: number, ing?: Ingredient): string {
  if (id === 'eggs') return `${Math.max(1, Math.round(g / 50))} eggs`
  if (ing?.category === 'pantry' || ing?.category === 'aromatic') return `${Math.max(5, round(g, 5))} g`
  return formatGrams(round(g))
}

// ---------- Swap ----------

export interface SwapOption {
  recipe: CatalogRecipe
  newCount: number
}

/** Same-kind alternatives for one slot, fewest new ingredients first. */
export function swapOptions(plan: WeekPlan, slotIndex: number, cat: Catalog): SwapOption[] {
  const target = plan.slots[slotIndex]
  const inPlan = new Set(plan.slots.map((s) => s.recipeId))
  const basket = new Set(
    plan.slots.flatMap((s, i) => (i === slotIndex || !cat.byId[s.recipeId] ? [] : freshIds(cat.byId[s.recipeId], cat))),
  )
  return cat.recipes
    .filter((r) => r.kind === target.slot && !r.hidden && !inPlan.has(r.id) && deadline(r, cat) >= target.day)
    .map((recipe) => ({ recipe, newCount: freshIds(recipe, cat).filter((id) => !basket.has(id)).length }))
    .sort((a, b) => a.newCount - b.newCount || Number(!!b.recipe.favourite) - Number(!!a.recipe.favourite) || a.recipe.name.localeCompare(b.recipe.name))
}

// ---------- Dates and history ----------

const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** The Sunday (shopping day) that starts the week containing `date`. */
export function weekStartOf(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() - d.getDay())
  return toISO(d)
}

export function addDays(iso: string, n: number): string {
  const d = fromISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function formatWeek(iso: string): string {
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${fmt(fromISO(iso))} – ${fmt(fromISO(addDays(iso, 6)))}`
}

/** Recipe ids cooked in the 2 weeks before `weekStart`. */
export function recentRecipeIds(weeks: WeekPlan[], weekStart: string): Set<string> {
  const from = addDays(weekStart, -14)
  return new Set(weeks.filter((w) => w.weekStart >= from && w.weekStart < weekStart).flatMap((w) => w.slots.map((s) => s.recipeId)))
}

export function mostCooked(weeks: WeekPlan[], cat: Catalog, limit = 10) {
  const counts = new Map<string, number>()
  for (const w of weeks) for (const s of w.slots) counts.set(s.recipeId, (counts.get(s.recipeId) ?? 0) + 1)
  return [...counts]
    .filter(([id]) => cat.byId[id])
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, count]) => ({ recipe: cat.byId[id], count }))
}
