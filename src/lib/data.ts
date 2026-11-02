// Household data derived from synced records, plus the actions that change it.
import { useMemo } from 'react'
import type { Ingredient } from '../data/ingredients.ts'
import { RECIPE_BY_ID, type Recipe } from '../data/recipes.ts'
import { DEFAULT_PEOPLE, type Person } from './nutrition.ts'
import { buildCatalog, type Catalog, type CatalogRecipe, type RecipeFlags, type WeekPlan } from './planner.ts'
import { put, remove, selectCollection, type Snapshot } from './store.ts'

/** A `recipes` record: flags only for a built-in recipe, or a full user recipe. */
export interface RecipeRecord extends RecipeFlags {
  recipe?: Recipe
}

export interface HouseholdData {
  people: Person[]
  catalog: Catalog
  weeks: Record<string, WeekPlan>
  checks: Record<string, boolean>
}

export function useHouseholdData(snap: Snapshot): HouseholdData {
  const { records } = snap
  return useMemo(() => {
    const people = selectCollection<Person[]>(records, 'profile').people ?? DEFAULT_PEOPLE
    const recipeRecs = selectCollection<RecipeRecord>(records, 'recipes')
    const custom: CatalogRecipe[] = []
    const flags: Record<string, RecipeFlags> = {}
    for (const [id, r] of Object.entries(recipeRecs)) {
      if (RECIPE_BY_ID[id]) flags[id] = { favourite: r.favourite, hidden: r.hidden }
      else if (r.recipe) custom.push({ ...r.recipe, id, favourite: r.favourite, hidden: r.hidden })
    }
    const ingredients = Object.values(selectCollection<Ingredient>(records, 'ingredients'))
    return {
      people,
      catalog: buildCatalog(custom, flags, ingredients),
      weeks: selectCollection<WeekPlan>(records, 'weeks'),
      checks: selectCollection<boolean>(records, 'checks'),
    }
  }, [records])
}

export const savePeople = (people: Person[]) => put('profile', 'people', people)
export const saveWeek = (plan: WeekPlan) => put('weeks', plan.weekStart, plan)
export const setCheck = (key: string, checked: boolean) => (checked ? put('checks', key, true) : remove('checks', key))

export function setRecipeFlags(r: CatalogRecipe, flags: RecipeFlags) {
  const next = { favourite: r.favourite, hidden: r.hidden, ...flags }
  if (r.custom) {
    const { favourite: _f, hidden: _h, custom: _c, ...recipe } = r
    put('recipes', r.id, { ...next, recipe })
  } else {
    put('recipes', r.id, next)
  }
}

export function saveRecipe(recipe: Recipe, flags: RecipeFlags = {}) {
  put('recipes', recipe.id, { ...flags, recipe })
}

export const deleteRecipe = (id: string) => remove('recipes', id)
export const saveIngredient = (ing: Ingredient) => put('ingredients', ing.id, ing)

export function newId(prefix: string, name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 30) || 'item'
  return `${prefix}_${slug}_${Math.random().toString(36).slice(2, 6)}`
}
