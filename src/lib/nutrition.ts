export type Sex = 'female' | 'male'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active'

export interface Person {
  name: string
  sex: Sex
  weightKg: number
  heightCm: number
  age: number
  activity: Activity
}

export const ACTIVITY_FACTORS: Record<Activity, { factor: number; label: string }> = {
  sedentary: { factor: 1.2, label: 'Sedentary (desk job, little exercise)' },
  light: { factor: 1.375, label: 'Light (exercise 1–3×/week)' },
  moderate: { factor: 1.55, label: 'Moderate (exercise 3–5×/week)' },
  active: { factor: 1.725, label: 'Active (hard exercise 6–7×/week)' },
}

/** Example profiles. Real ones are entered in the app and stored on the household's server only. */
export const DEFAULT_PEOPLE: Person[] = [
  { name: 'Her', sex: 'female', weightKg: 55, heightCm: 163, age: 30, activity: 'light' },
  { name: 'Him', sex: 'male', weightKg: 70, heightCm: 175, age: 30, activity: 'light' },
]

/** Grams of protein per kg of body weight per day. */
export const PROTEIN_PER_KG = 1.2
/** Share of daily protein expected from meat, fish, eggs and tofu. The rest comes from rice, noodles, milk and so on. */
export const PROTEIN_FOOD_SHARE = 0.65

export interface DailyTargets {
  kcal: number
  protein: number
  veg: number
  fruit: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const roundTo = (v: number, step: number) => Math.round(v / step) * step

/** Mifflin-St Jeor resting energy × activity factor. */
export function dailyCalories(p: Person): number {
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'male' ? 5 : -161)
  return roundTo(bmr * ACTIVITY_FACTORS[p.activity].factor, 10)
}

/**
 * Vegetables and fruit follow the Chinese Dietary Guidelines ranges
 * (veg 300–500 g, fruit 200–350 g), placed within the range by energy needs.
 */
export function dailyTargets(p: Person): DailyTargets {
  const kcal = dailyCalories(p)
  return {
    kcal,
    protein: Math.round(p.weightKg * PROTEIN_PER_KG),
    veg: roundTo(clamp(kcal / 4, 300, 500), 50),
    fruit: roundTo(clamp(kcal / 8, 200, 350), 50),
  }
}

export interface HouseholdTargets {
  perPerson: DailyTargets[]
  /** Combined weekly totals for everyone. */
  week: DailyTargets
  /** Weekly protein grams that should come from protein foods. */
  weekProteinFromFoods: number
}

export function householdTargets(people: Person[]): HouseholdTargets {
  const perPerson = people.map(dailyTargets)
  const sum = (k: keyof DailyTargets) => perPerson.reduce((s, t) => s + t[k], 0) * 7
  const week = { kcal: sum('kcal'), protein: sum('protein'), veg: sum('veg'), fruit: sum('fruit') }
  return { perPerson, week, weekProteinFromFoods: Math.round(week.protein * PROTEIN_FOOD_SHARE) }
}
