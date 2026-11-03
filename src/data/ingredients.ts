export type Category = 'protein' | 'veg' | 'fruit' | 'aromatic' | 'pantry'

export interface Ingredient {
  id: string
  name: string
  category: Category
  /** Grams of protein per 100 g raw. */
  protein: number
  /**
   * Last day index it is still good to cook, counted from the Sunday shop
   * (0 = Sun … 6 = Sat). Freezable proteins are frozen on Sunday, so they last
   * the whole week.
   */
  useBy: number
  freezable?: boolean
  /** Leafy greens: at least one should be on the menu each week. */
  leafy?: boolean
  /** Sturdy vegetable that can be washed and cut on Sunday. */
  preCut?: boolean
  /** Proteins of the same family (e.g. chicken thigh and breast) count once for variety. */
  family?: string
  /** Potatoes are bought with the vegetables but count as a starch, not a vegetable. */
  notVeg?: boolean
  /** Typical weight of one piece, for "~3 tomatoes" hints. */
  each?: { g: number; label: string; plural?: string }
  storage: string
}

const list: Ingredient[] = [
  // Protein
  { id: 'chicken_thigh', name: 'Chicken thigh (boneless)', category: 'protein', family: 'chicken', protein: 18, useBy: 6, freezable: true, storage: 'Portion, marinate and freeze flat in labelled bags. Thaw in the fridge overnight.' },
  { id: 'chicken_breast', name: 'Chicken breast', category: 'protein', family: 'chicken', protein: 23, useBy: 6, freezable: true, storage: 'Slice or cube before freezing so it thaws fast. Thaw in the fridge overnight.' },
  { id: 'pork', name: 'Pork shoulder / loin', category: 'protein', family: 'pork', protein: 20, useBy: 6, freezable: true, storage: 'Slice or cube, then freeze in meal-sized bags.' },
  { id: 'pork_mince', name: 'Minced pork', category: 'protein', family: 'pork', protein: 17, useBy: 6, freezable: true, storage: 'Freeze flat in a thin layer, so you can snap off what you need.' },
  { id: 'beef', name: 'Beef (flank / chuck)', category: 'protein', protein: 20, useBy: 6, freezable: true, storage: 'Slice thin against the grain for stir-fries, or cube for stews, then freeze.' },
  { id: 'fish', name: 'White fish fillet', category: 'protein', family: 'seafood', protein: 18, useBy: 1, storage: 'Fresh fish: keep on ice in the coldest part of the fridge, and cook by Tuesday.' },
  { id: 'shrimp', name: 'Shrimp (frozen, peeled)', category: 'protein', family: 'seafood', protein: 18, useBy: 6, freezable: true, storage: 'Buy frozen and keep it frozen. Thaw under cold running water in 10 minutes.' },
  { id: 'eggs', name: 'Eggs', category: 'protein', protein: 13, useBy: 6, each: { g: 50, label: 'egg', plural: 'eggs' }, storage: 'Keep refrigerated in their carton, not in the door.' },
  { id: 'tofu', name: 'Firm tofu', category: 'protein', protein: 8, useBy: 6, each: { g: 400, label: 'block', plural: 'blocks' }, storage: 'Keep sealed until use. Once opened, cover with water in a box and change the water daily.' },

  // Vegetables (useBy reflects real fridge life)
  { id: 'bok_choy', name: 'Bok choy', category: 'veg', leafy: true, protein: 1.5, useBy: 2, storage: 'Leafy: do not wash until use. Wrap in paper towel inside a bag.' },
  { id: 'spinach', name: 'Spinach', category: 'veg', leafy: true, protein: 2.9, useBy: 2, storage: 'Leafy: do not wash until use. Keep in its box with a paper towel.' },
  { id: 'mushroom', name: 'Mushrooms', category: 'veg', protein: 3.1, useBy: 3, storage: 'Store in a paper bag, not plastic. Wipe clean, do not soak.' },
  { id: 'eggplant', name: 'Eggplant', category: 'veg', protein: 1, useBy: 3, each: { g: 300, label: 'eggplant', plural: 'eggplants' }, storage: 'Keep whole and dry in the crisper. Cut just before cooking.' },
  { id: 'broccoli', name: 'Broccoli', category: 'veg', preCut: true, protein: 2.8, useBy: 3, each: { g: 400, label: 'head', plural: 'heads' }, storage: 'Cut into florets, wash, dry well, and store in a box with a paper towel.' },
  { id: 'green_beans', name: 'Green beans', category: 'veg', preCut: true, protein: 1.8, useBy: 3, storage: 'Trim, wash, dry, and store in a lined box.' },
  { id: 'zucchini', name: 'Zucchini', category: 'veg', protein: 1.2, useBy: 3, each: { g: 250, label: 'zucchini', plural: 'zucchini' }, storage: 'Keep whole and dry in the crisper.' },
  { id: 'cucumber', name: 'Cucumber', category: 'veg', protein: 0.7, useBy: 4, each: { g: 300, label: 'cucumber', plural: 'cucumbers' }, storage: 'Wrap in a towel and keep in the warmer front of the fridge.' },
  { id: 'bell_pepper', name: 'Bell pepper', category: 'veg', preCut: true, protein: 1, useBy: 4, each: { g: 150, label: 'pepper', plural: 'peppers' }, storage: 'Keep whole in the crisper. Slice for the first 2–3 days on Sunday.' },
  { id: 'tomato', name: 'Tomatoes', category: 'veg', protein: 0.9, useBy: 4, each: { g: 150, label: 'tomato', plural: 'tomatoes' }, storage: 'Keep ripe ones on the counter for 2 days. Put the rest in the fridge.' },
  { id: 'celery', name: 'Celery', category: 'veg', preCut: true, protein: 0.7, useBy: 6, storage: 'Wrap tightly in foil to keep it crisp for 1–2 weeks.' },
  { id: 'napa', name: 'Napa cabbage', category: 'veg', protein: 1.2, useBy: 6, each: { g: 1000, label: 'head', plural: 'heads' }, storage: 'Keep whole and peel leaves from the outside. Lasts 1–2 weeks.' },
  { id: 'cabbage', name: 'Cabbage', category: 'veg', preCut: true, protein: 1.3, useBy: 6, each: { g: 1000, label: 'head', plural: 'heads' }, storage: 'Keep whole and cut as needed. Lasts 2+ weeks.' },
  { id: 'carrot', name: 'Carrots', category: 'veg', preCut: true, protein: 0.9, useBy: 6, each: { g: 120, label: 'carrot', plural: 'carrots' }, storage: 'Remove the tops and keep them in a bag in the crisper.' },
  { id: 'onion', name: 'Onions', category: 'veg', preCut: true, protein: 1.1, useBy: 6, each: { g: 200, label: 'onion', plural: 'onions' }, storage: 'Keep in a cool, dark, dry place. Not next to potatoes.' },
  { id: 'potato', name: 'Potatoes', category: 'veg', protein: 2, useBy: 6, notVeg: true, each: { g: 200, label: 'potato', plural: 'potatoes' }, storage: 'Keep in a cool, dark place, away from onions.' },

  // Aromatics: bought every week, not counted towards the "used twice" rule
  { id: 'garlic', name: 'Garlic', category: 'aromatic', protein: 0, useBy: 6, storage: 'Keep whole heads in a dry basket.' },
  { id: 'ginger', name: 'Ginger', category: 'aromatic', protein: 0, useBy: 6, storage: 'Keep in the fridge. Freeze extra and grate it from frozen.' },
  { id: 'scallion', name: 'Scallions', category: 'aromatic', protein: 0, useBy: 5, storage: 'Stand the roots in a glass of water, or chop and freeze.' },

  // Pantry
  { id: 'rice', name: 'Rice', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'noodles', name: 'Noodles', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'pasta', name: 'Pasta', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'soy_sauce', name: 'Soy sauce', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'oyster_sauce', name: 'Oyster sauce', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'doubanjiang', name: 'Doubanjiang (chili bean paste)', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'vinegar', name: 'Chinkiang / rice vinegar', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'cornstarch', name: 'Cornstarch', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'peanuts', name: 'Roasted peanuts', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'curry_roux', name: 'Curry roux blocks', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'milk', name: 'Milk', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'olive_oil', name: 'Olive oil', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'lemon', name: 'Lemon', category: 'pantry', protein: 0, useBy: 6, storage: '' },
]

export const INGREDIENTS: Record<string, Ingredient> = Object.fromEntries(list.map((i) => [i.id, i]))

export interface Fruit {
  id: string
  name: string
  useBy: number
  each: { g: number; label: string; plural?: string }
  storage: string
}

export const FRUITS: Fruit[] = [
  { id: 'berries', name: 'Strawberries / blueberries', useBy: 1, each: { g: 250, label: 'punnet', plural: 'punnets' }, storage: 'Do not wash until eating. Keep in the fridge on a paper towel.' },
  { id: 'grapes', name: 'Grapes', useBy: 3, each: { g: 500, label: 'bunch', plural: 'bunches' }, storage: 'Keep unwashed in the fridge.' },
  { id: 'banana', name: 'Bananas', useBy: 3, each: { g: 120, label: 'banana', plural: 'bananas' }, storage: 'Buy some green. Keep on the counter, away from other fruit.' },
  { id: 'mango', name: 'Mango', useBy: 3, each: { g: 300, label: 'mango', plural: 'mangoes' }, storage: 'Ripen on the counter, then move to the fridge.' },
  { id: 'pear', name: 'Pears', useBy: 5, each: { g: 180, label: 'pear', plural: 'pears' }, storage: 'Keep firm ones in the fridge. Ripen 1–2 days on the counter before eating.' },
  { id: 'kiwi', name: 'Kiwis', useBy: 6, each: { g: 80, label: 'kiwi', plural: 'kiwis' }, storage: 'Firm kiwis keep for 2 weeks in the fridge.' },
  { id: 'apple', name: 'Apples', useBy: 6, each: { g: 180, label: 'apple', plural: 'apples' }, storage: 'Keep in the crisper, away from leafy greens.' },
  { id: 'orange', name: 'Oranges / mandarins', useBy: 6, each: { g: 150, label: 'orange', plural: 'oranges' }, storage: 'Keep in the fridge for up to 2 weeks.' },
]

export const FRUIT_BY_ID: Record<string, Fruit> = Object.fromEntries(FRUITS.map((f) => [f.id, f]))
