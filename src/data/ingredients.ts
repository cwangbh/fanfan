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
  /** Measured in ml in recipe steps (sauces, oils, wine). */
  ml?: boolean
  /** Kitchen basics (oil, salt, sugar): not listed on the shopping list. */
  basic?: boolean
  storage: string
}

const list: Ingredient[] = [
  // Protein
  { id: 'chicken_thigh', name: 'Chicken thigh (boneless) 鸡腿肉', category: 'protein', family: 'chicken', protein: 18, useBy: 6, freezable: true, storage: 'Portion, marinate and freeze flat in labelled bags. Thaw in the fridge overnight.' },
  { id: 'chicken_breast', name: 'Chicken breast 鸡胸肉', category: 'protein', family: 'chicken', protein: 23, useBy: 6, freezable: true, storage: 'Slice or cube before freezing so it thaws fast. Thaw in the fridge overnight.' },
  { id: 'pork', name: 'Pork shoulder / loin 猪里脊/梅花肉', category: 'protein', family: 'pork', protein: 20, useBy: 6, freezable: true, storage: 'Slice or cube, then freeze in meal-sized bags.' },
  { id: 'pork_mince', name: 'Minced pork 猪肉末', category: 'protein', family: 'pork', protein: 17, useBy: 6, freezable: true, storage: 'Freeze flat in a thin layer, so you can snap off what you need.' },
  { id: 'beef', name: 'Beef (flank / chuck) 牛肉', category: 'protein', protein: 20, useBy: 6, freezable: true, storage: 'Slice thin against the grain for stir-fries, or cube for stews, then freeze.' },
  { id: 'fish', name: 'White fish fillet 鲈鱼/白鱼', category: 'protein', family: 'seafood', protein: 18, useBy: 1, storage: 'Fresh fish: keep on ice in the coldest part of the fridge, and cook by Tuesday.' },
  { id: 'shrimp', name: 'Shrimp (frozen, peeled) 虾', category: 'protein', family: 'seafood', protein: 18, useBy: 6, freezable: true, storage: 'Buy frozen and keep it frozen. Thaw under cold running water in 10 minutes.' },
  { id: 'eggs', name: 'Eggs 鸡蛋', category: 'protein', protein: 13, useBy: 6, each: { g: 50, label: 'egg', plural: 'eggs' }, storage: 'Keep refrigerated in their carton, not in the door.' },
  { id: 'tofu', name: 'Firm tofu 老豆腐', category: 'protein', protein: 8, useBy: 6, each: { g: 400, label: 'block', plural: 'blocks' }, storage: 'Keep sealed until use. Once opened, cover with water in a box and change the water daily.' },

  { id: 'pork_ribs', name: 'Pork ribs 排骨', category: 'protein', family: 'pork', protein: 17, useBy: 6, freezable: true, storage: 'Ask the butcher to chop them into 4 cm pieces. Freeze in meal-sized bags.' },
  { id: 'pork_belly', name: 'Pork belly 五花肉', category: 'protein', family: 'pork', protein: 14, useBy: 6, freezable: true, storage: 'Freeze in meal-sized pieces. Half-thawed belly is easiest to slice thin.' },
  { id: 'chicken_wings', name: 'Chicken wings 鸡翅中', category: 'protein', family: 'chicken', protein: 17, useBy: 6, freezable: true, storage: 'Score both sides before freezing so they marinate fast after thawing.' },
  { id: 'dried_tofu', name: 'Pressed tofu 香干', category: 'protein', protein: 16, useBy: 5, each: { g: 150, label: 'pack', plural: 'packs' }, storage: 'Keep sealed in the fridge.' },

  // Vegetables (useBy reflects real fridge life)
  { id: 'bok_choy', name: 'Bok choy 青菜', category: 'veg', leafy: true, protein: 1.5, useBy: 2, storage: 'Leafy: do not wash until use. Wrap in paper towel inside a bag.' },
  { id: 'spinach', name: 'Spinach 菠菜', category: 'veg', leafy: true, protein: 2.9, useBy: 2, storage: 'Leafy: do not wash until use. Keep in its box with a paper towel.' },
  { id: 'mushroom', name: 'Mushrooms 香菇/蘑菇', category: 'veg', protein: 3.1, useBy: 3, storage: 'Store in a paper bag, not plastic. Wipe clean, do not soak.' },
  { id: 'eggplant', name: 'Eggplant 茄子', category: 'veg', protein: 1, useBy: 3, each: { g: 300, label: 'eggplant', plural: 'eggplants' }, storage: 'Keep whole and dry in the crisper. Cut just before cooking.' },
  { id: 'broccoli', name: 'Broccoli 西兰花', category: 'veg', preCut: true, protein: 2.8, useBy: 3, each: { g: 400, label: 'head', plural: 'heads' }, storage: 'Cut into florets, wash, dry well, and store in a box with a paper towel.' },
  { id: 'green_beans', name: 'Green beans 豆角', category: 'veg', preCut: true, protein: 1.8, useBy: 3, storage: 'Trim, wash, dry, and store in a lined box.' },
  { id: 'zucchini', name: 'Zucchini 西葫芦', category: 'veg', protein: 1.2, useBy: 3, each: { g: 250, label: 'zucchini', plural: 'zucchini' }, storage: 'Keep whole and dry in the crisper.' },
  { id: 'cucumber', name: 'Cucumber 黄瓜', category: 'veg', protein: 0.7, useBy: 4, each: { g: 300, label: 'cucumber', plural: 'cucumbers' }, storage: 'Wrap in a towel and keep in the warmer front of the fridge.' },
  { id: 'bell_pepper', name: 'Bell pepper 彩椒', category: 'veg', preCut: true, protein: 1, useBy: 4, each: { g: 150, label: 'pepper', plural: 'peppers' }, storage: 'Keep whole in the crisper. Slice for the first 2–3 days on Sunday.' },
  { id: 'tomato', name: 'Tomatoes 西红柿', category: 'veg', protein: 0.9, useBy: 4, each: { g: 150, label: 'tomato', plural: 'tomatoes' }, storage: 'Keep ripe ones on the counter for 2 days. Put the rest in the fridge.' },
  { id: 'celery', name: 'Celery 芹菜', category: 'veg', preCut: true, protein: 0.7, useBy: 6, storage: 'Wrap tightly in foil to keep it crisp for 1–2 weeks.' },
  { id: 'napa', name: 'Napa cabbage 大白菜', category: 'veg', protein: 1.2, useBy: 6, each: { g: 1000, label: 'head', plural: 'heads' }, storage: 'Keep whole and peel leaves from the outside. Lasts 1–2 weeks.' },
  { id: 'cabbage', name: 'Cabbage 包菜', category: 'veg', preCut: true, protein: 1.3, useBy: 6, each: { g: 1000, label: 'head', plural: 'heads' }, storage: 'Keep whole and cut as needed. Lasts 2+ weeks.' },
  { id: 'carrot', name: 'Carrots 胡萝卜', category: 'veg', preCut: true, protein: 0.9, useBy: 6, each: { g: 120, label: 'carrot', plural: 'carrots' }, storage: 'Remove the tops and keep them in a bag in the crisper.' },
  { id: 'onion', name: 'Onions 洋葱', category: 'veg', preCut: true, protein: 1.1, useBy: 6, each: { g: 200, label: 'onion', plural: 'onions' }, storage: 'Keep in a cool, dark, dry place. Not next to potatoes.' },
  { id: 'potato', name: 'Potatoes 土豆', category: 'veg', protein: 2, useBy: 6, notVeg: true, each: { g: 200, label: 'potato', plural: 'potatoes' }, storage: 'Keep in a cool, dark place, away from onions.' },

  { id: 'greens', name: 'Leafy greens 青菜/生菜/菜心', category: 'veg', leafy: true, protein: 1.5, useBy: 2, storage: 'Leafy: buy any of them. Do not wash until use. Wrap in paper towel inside a bag.' },
  { id: 'cauliflower', name: 'Cauliflower 花菜', category: 'veg', preCut: true, protein: 1.9, useBy: 4, each: { g: 600, label: 'head', plural: 'heads' }, storage: 'Break into florets, keep dry in a bag in the crisper.' },
  { id: 'green_pepper', name: 'Green pepper 青椒/尖椒', category: 'veg', preCut: true, protein: 1, useBy: 4, each: { g: 60, label: 'pepper', plural: 'peppers' }, storage: 'Keep whole and dry in the crisper.' },
  { id: 'daikon', name: 'Daikon 白萝卜', category: 'veg', protein: 0.6, useBy: 6, each: { g: 800, label: 'daikon', plural: 'daikons' }, storage: 'Cut off the leaves, wrap in paper and keep in the crisper. Lasts 2 weeks.' },
  { id: 'edamame', name: 'Shelled edamame (frozen) 毛豆米', category: 'veg', protein: 13, useBy: 6, freezable: true, storage: 'Buy frozen and keep frozen. Cook straight from frozen.' },

  // Aromatics: bought every week, not counted towards the "used twice" rule
  { id: 'garlic', name: 'Garlic 大蒜', category: 'aromatic', protein: 0, useBy: 6, storage: 'Keep whole heads in a dry basket.' },
  { id: 'ginger', name: 'Ginger 姜', category: 'aromatic', protein: 0, useBy: 6, storage: 'Keep in the fridge. Freeze extra and grate it from frozen.' },
  { id: 'scallion', name: 'Scallions 葱', category: 'aromatic', protein: 0, useBy: 5, storage: 'Stand the roots in a glass of water, or chop and freeze.' },

  { id: 'chili', name: 'Fresh chili 小米辣', category: 'aromatic', protein: 0, useBy: 6, storage: 'Keep in a bag in the fridge, or freeze.' },

  // Pantry
  { id: 'rice', name: 'Rice 米', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'noodles', name: 'Noodles 面条', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'pasta', name: 'Pasta 意面', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'soy_sauce', ml: true, name: 'Soy sauce 生抽', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'oyster_sauce', ml: true, name: 'Oyster sauce 蚝油', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'doubanjiang', name: 'Doubanjiang (chili bean paste) 豆瓣酱', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'vinegar', ml: true, name: 'Chinkiang / rice vinegar 醋', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'cornstarch', name: 'Cornstarch 淀粉', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'peanuts', name: 'Roasted peanuts 花生', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'curry_roux', name: 'Curry roux blocks 咖喱块', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'milk', ml: true, name: 'Milk 牛奶', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'olive_oil', ml: true, name: 'Olive oil 橄榄油', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'lemon', name: 'Lemon 柠檬', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'oil', ml: true, basic: true, name: 'Cooking oil 食用油', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'salt', basic: true, name: 'Salt 盐', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'sugar', basic: true, name: 'Sugar 白糖', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'rock_sugar', name: 'Rock sugar 冰糖', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'dark_soy', ml: true, name: 'Dark soy sauce 老抽', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'cooking_wine', ml: true, name: 'Shaoxing wine 料酒', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'sesame_oil', ml: true, name: 'Sesame oil 香油', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'star_anise', name: 'Star anise 八角', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'sichuan_pepper', name: 'Sichuan peppercorns 花椒', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'dried_chili', name: 'Dried chilies 干辣椒', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'spices', name: 'Cinnamon & bay leaves 桂皮香叶', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'five_spice', name: 'Five-spice / 十三香', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'white_pepper', name: 'White pepper 白胡椒粉', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'black_pepper', name: 'Black pepper 黑胡椒', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'bean_paste', name: 'Soybean paste 黄豆酱 / 柱侯酱', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'ketchup', name: 'Ketchup 番茄酱', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'cola', ml: true, name: 'Cola 可乐', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'honey', ml: true, name: 'Honey 蜂蜜', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'sesame', name: 'Sesame seeds 白芝麻', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'nori', name: 'Dried laver 紫菜', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'wood_ear', name: 'Dried wood ear 木耳', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'glass_noodles', name: 'Glass noodles 粉条/粉丝', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'rice_cake', name: 'Rice cakes 年糕', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'olive_veg', name: 'Preserved olive greens 橄榄菜', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'peas_corn', name: 'Frozen peas & corn 青豆玉米', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'duojiao', name: 'Chopped salted chili 剁椒', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'chestnuts', name: 'Peeled chestnuts 板栗仁', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'rice_powder', name: 'Steamed-pork rice powder 蒸肉米粉', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'meigancai', name: 'Dried preserved mustard greens 梅干菜', category: 'pantry', protein: 0, useBy: 6, storage: '' },
  { id: 'dried_shiitake', name: 'Dried shiitake 干香菇', category: 'pantry', protein: 0, useBy: 6, storage: '' },
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
