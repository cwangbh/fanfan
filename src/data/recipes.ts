export type DishKind = 'main' | 'veg' | 'soup' | 'onepot'

export interface Recipe {
  id: string
  name: string
  kind: DishKind
  cuisine: string
  minutes: number
  /** Main that reheats and freezes well, so it can be cooked on Sunday for a weekday dinner. */
  cookAhead?: boolean
  /** Chinese name, shown first in the app. */
  zh?: string
  /** Where the recipe comes from. */
  source?: string
  /** Replaced by a better version: kept so old weeks still show it, but never planned or listed. */
  retired?: boolean
  /** Grams for one meal for two people. The planner scales this to the batch size and the nutrition targets. */
  items: Record<string, number>
  steps: string[]
}

const htc = (path: string) => `https://github.com/Anduin2017/HowToCook/blob/master/dishes/${path}.md`
const hoc = (path: string) => `https://github.com/Gar-b-age/CookLikeHOC/blob/main/${path}.md`

export const RECIPES: Recipe[] = [
  // ---------- Mains ----------
  {
    id: 'tomato_egg', name: 'Tomato & egg stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { eggs: 200, tomato: 300, scallion: 10 },
    steps: ['Beat the eggs with a pinch of salt. Cut the tomatoes into wedges.', 'Scramble the eggs in hot oil until just set, then remove them.', 'Stir-fry the tomatoes until soft and juicy. Add 1 tsp sugar and a pinch of salt.', 'Return the eggs, toss, and finish with scallions.'],
  },
  {
    id: 'kung_pao_chicken', name: 'Kung pao chicken', kind: 'main', cuisine: 'Chinese', minutes: 20, retired: true, cookAhead: true,
    items: { chicken_thigh: 250, bell_pepper: 100, cucumber: 100, peanuts: 30, garlic: 10, ginger: 5, scallion: 10, soy_sauce: 15, vinegar: 10, cornstarch: 5 },
    steps: ['Cube the chicken and marinate it with soy sauce and cornstarch.', 'Mix the sauce: 1 tbsp soy sauce, 1 tbsp vinegar, 1 tsp sugar, ½ tsp cornstarch, 2 tbsp water.', 'Sear the chicken until golden. Add garlic, ginger, the diced pepper and cucumber.', 'Pour in the sauce, toss until glossy, then add peanuts and scallions.'],
  },
  {
    id: 'red_braised_pork', name: 'Red-braised pork with eggs', kind: 'main', cuisine: 'Chinese', minutes: 70, retired: true, cookAhead: true,
    items: { pork: 250, eggs: 100, ginger: 10, scallion: 10, soy_sauce: 30 },
    steps: ['Hard-boil and peel the eggs. Cube the pork and blanch it for 2 minutes.', 'Caramelise 1 tbsp sugar in oil, add the pork, and toss until coated.', 'Add ginger, scallions, soy sauce and hot water to cover. Simmer covered for 50 minutes.', 'Add the eggs, then reduce uncovered until the sauce is sticky.'],
  },
  {
    id: 'beef_broccoli', name: 'Beef & broccoli', kind: 'main', cuisine: 'Chinese', minutes: 20, retired: true, cookAhead: true,
    items: { beef: 220, broccoli: 250, garlic: 10, oyster_sauce: 20, soy_sauce: 10, cornstarch: 5 },
    steps: ['Slice the beef thin and marinate it with soy sauce and cornstarch.', 'Blanch the broccoli for 1 minute, then drain.', 'Sear the beef on high heat until just browned, then remove it.', 'Fry the garlic, add the broccoli, beef and oyster sauce, and toss for 1 minute.'],
  },
  {
    id: 'steamed_fish', name: 'Steamed fish with ginger & scallion', kind: 'main', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { fish: 300, ginger: 15, scallion: 20, soy_sauce: 20 },
    steps: ['Lay the fish on a plate on top of ginger slices.', 'Steam for 8–10 minutes until the fish flakes.', 'Pour off the liquid, top with shredded scallion and ginger, and drizzle with soy sauce.', 'Pour 2 tbsp smoking-hot oil over the top.'],
  },
  {
    id: 'mapo_tofu', name: 'Mapo tofu', kind: 'main', cuisine: 'Chinese', minutes: 20, retired: true, cookAhead: true,
    items: { tofu: 400, pork_mince: 100, garlic: 10, scallion: 10, doubanjiang: 20, cornstarch: 5 },
    steps: ['Cube the tofu and simmer it in salted water for 2 minutes, then drain.', 'Fry the pork until crisp, then add the doubanjiang and garlic until the oil turns red.', 'Add ½ cup water and the tofu, and simmer for 5 minutes.', 'Thicken with cornstarch slurry and top with scallions.'],
  },
  {
    id: 'shrimp_eggs', name: 'Shrimp scrambled eggs', kind: 'main', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { shrimp: 200, eggs: 150, scallion: 10, cornstarch: 3 },
    steps: ['Pat the shrimp dry and toss with salt and cornstarch.', 'Sear the shrimp until pink, then remove them.', 'Beat the eggs with scallions and pour into the pan.', 'Fold the shrimp back in when the eggs are half set, and take off the heat while they are still soft.'],
  },
  {
    id: 'garlic_shrimp_broccoli', name: 'Garlic shrimp & broccoli', kind: 'main', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { shrimp: 220, broccoli: 200, garlic: 15, oyster_sauce: 10 },
    steps: ['Blanch the broccoli for 1 minute.', 'Fry plenty of minced garlic in oil until fragrant.', 'Add the shrimp and cook until pink.', 'Add the broccoli and oyster sauce, and toss for 1 minute.'],
  },
  {
    id: 'sheet_pan_chicken', name: 'Sheet-pan chicken, potatoes & carrots', kind: 'main', cuisine: 'Western', minutes: 40, cookAhead: true,
    items: { chicken_thigh: 300, potato: 300, carrot: 150, onion: 150, garlic: 10, olive_oil: 15, lemon: 30 },
    steps: ['Heat the oven to 220°C / 425°F.', 'Toss the cubed potatoes, carrots and onion wedges with oil, salt and garlic.', 'Put the chicken on top, season it, and squeeze over the lemon.', 'Roast for 30–35 minutes until the chicken is golden.'],
  },
  {
    id: 'beef_stew', name: 'Beef, carrot & tomato stew', kind: 'main', cuisine: 'Western', minutes: 90, cookAhead: true,
    items: { beef: 250, carrot: 200, potato: 200, onion: 150, tomato: 150, garlic: 10 },
    steps: ['Brown the cubed beef in batches.', 'Soften the onion and garlic, then add the chopped tomato.', 'Add the beef back with water to cover, and simmer covered for 60 minutes.', 'Add chunks of carrot and potato, and cook 25 more minutes until tender.'],
  },
  {
    id: 'pepper_pork', name: 'Pork with bell peppers', kind: 'main', cuisine: 'Chinese', minutes: 15, retired: true, cookAhead: true,
    items: { pork: 220, bell_pepper: 200, garlic: 10, soy_sauce: 15, cornstarch: 5 },
    steps: ['Slice the pork thin and marinate it with soy sauce and cornstarch.', 'Stir-fry the pork until it changes colour, then remove it.', 'Fry the garlic and the sliced peppers for 2 minutes.', 'Return the pork, add a splash of soy sauce, and toss.'],
  },
  {
    id: 'chicken_mushroom', name: 'Chicken, mushroom & pepper stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 20, retired: true, cookAhead: true,
    items: { chicken_breast: 250, mushroom: 200, bell_pepper: 100, garlic: 10, oyster_sauce: 15, cornstarch: 5 },
    steps: ['Slice the chicken and coat it with cornstarch and a pinch of salt.', 'Sear the chicken until golden, then remove it.', 'Fry the mushrooms until browned, then add the garlic and peppers.', 'Return the chicken, add the oyster sauce, and toss.'],
  },
  {
    id: 'beef_tomato', name: 'Tomato beef with onion', kind: 'main', cuisine: 'Chinese', minutes: 20, retired: true, cookAhead: true,
    items: { beef: 220, tomato: 250, onion: 100, soy_sauce: 15, cornstarch: 5 },
    steps: ['Slice the beef and marinate it with soy sauce and cornstarch.', 'Sear the beef quickly, then remove it.', 'Soften the onion, then add the tomato wedges and 1 tsp sugar, and cook into a sauce.', 'Return the beef and toss for 30 seconds.'],
  },
  {
    id: 'cabbage_pork', name: 'Hand-torn cabbage with pork', kind: 'main', cuisine: 'Chinese', minutes: 15, retired: true, cookAhead: true,
    items: { pork: 150, cabbage: 300, garlic: 10, vinegar: 10, soy_sauce: 15 },
    steps: ['Tear the cabbage into pieces and slice the pork thin.', 'Render the pork until lightly crisp.', 'Add the garlic and cabbage, and stir-fry on high heat for 3 minutes.', 'Splash in vinegar and soy sauce around the edge of the wok, and toss.'],
  },
  {
    id: 'eggplant_pork', name: 'Fish-fragrant eggplant with pork', kind: 'main', cuisine: 'Chinese', minutes: 25, retired: true, cookAhead: true,
    items: { pork_mince: 150, eggplant: 350, garlic: 10, ginger: 5, scallion: 10, doubanjiang: 15, vinegar: 10 },
    steps: ['Cut the eggplant into batons and pan-fry until soft, then remove it.', 'Fry the pork until crisp, then add the doubanjiang, garlic and ginger.', 'Add the eggplant with 1 tbsp vinegar, 1 tsp sugar and ¼ cup water.', 'Simmer for 3 minutes and top with scallions.'],
  },
  {
    id: 'chicken_curry', name: 'Japanese chicken curry', kind: 'main', cuisine: 'Western', minutes: 35, cookAhead: true,
    items: { chicken_thigh: 250, potato: 200, carrot: 150, onion: 150, curry_roux: 50 },
    steps: ['Brown the chicken pieces with the sliced onion.', 'Add the carrot and potato chunks with 2 cups water. Simmer for 15 minutes.', 'Turn off the heat and melt in the curry roux.', 'Simmer for 5 more minutes until thick. Serve with rice.'],
  },
  {
    id: 'fish_tofu', name: 'Braised fish with tofu', kind: 'main', cuisine: 'Chinese', minutes: 25, retired: true,
    items: { fish: 250, tofu: 200, ginger: 10, scallion: 10, soy_sauce: 20 },
    steps: ['Cut the fish into chunks and pan-fry until golden on both sides.', 'Add ginger, sliced tofu, soy sauce, 1 tsp sugar and ½ cup water.', 'Simmer gently for 8 minutes, spooning the sauce over.', 'Finish with scallions.'],
  },
  {
    id: 'lemon_fish_zucchini', name: 'Pan-fried lemon fish with zucchini', kind: 'main', cuisine: 'Western', minutes: 15,
    items: { fish: 300, zucchini: 250, garlic: 10, olive_oil: 15, lemon: 30 },
    steps: ['Season the fish with salt and pepper and pat it dry.', 'Pan-fry for 3 minutes per side, then remove it.', 'Sauté the sliced zucchini with garlic until golden.', 'Serve the fish on the zucchini and squeeze over the lemon.'],
  },
  {
    id: 'chicken_broccoli_carrot', name: 'Chicken, broccoli & carrot stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 20, retired: true, cookAhead: true,
    items: { chicken_breast: 250, broccoli: 200, carrot: 100, garlic: 10, soy_sauce: 15, cornstarch: 5 },
    steps: ['Slice the chicken and marinate it with soy sauce and cornstarch.', 'Blanch the broccoli and sliced carrot for 1 minute.', 'Sear the chicken, then add the garlic and vegetables.', 'Toss with a splash of soy sauce and water until glossy.'],
  },
  {
    id: 'pork_green_beans', name: 'Dry-fried green beans with pork', kind: 'main', cuisine: 'Chinese', minutes: 20, retired: true, cookAhead: true,
    items: { pork_mince: 150, green_beans: 300, garlic: 10, soy_sauce: 15 },
    steps: ['Pan-fry the green beans in oil until blistered, then remove them.', 'Fry the pork until crisp and browned.', 'Add the garlic, the beans and soy sauce.', 'Toss on high heat for 1 minute.'],
  },
  {
    id: 'beef_celery', name: 'Beef & celery stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 15, retired: true, cookAhead: true,
    items: { beef: 200, celery: 200, carrot: 80, ginger: 5, soy_sauce: 15, cornstarch: 5 },
    steps: ['Shred the beef and marinate it with soy sauce and cornstarch.', 'Cut the celery and carrot into matchsticks.', 'Sear the beef on high heat, then remove it.', 'Stir-fry the ginger, celery and carrot for 2 minutes, then return the beef.'],
  },
  {
    id: 'lions_head', name: "Lion's head meatballs with napa cabbage", kind: 'main', cuisine: 'Chinese', minutes: 45, cookAhead: true,
    items: { pork_mince: 250, napa: 300, ginger: 10, scallion: 10, soy_sauce: 20, cornstarch: 10 },
    steps: ['Mix the pork with grated ginger, scallions, soy sauce, cornstarch and 2 tbsp water. Form 4–6 balls.', 'Brown the meatballs on all sides.', 'Line a pot with napa leaves, put the meatballs on top, and add water halfway up.', 'Simmer covered for 30 minutes.'],
  },
  {
    id: 'chicken_spinach_pasta', name: 'Chicken, spinach & mushroom pasta', kind: 'main', cuisine: 'Western', minutes: 25,
    items: { chicken_breast: 220, spinach: 150, mushroom: 150, pasta: 200, garlic: 10, milk: 100 },
    steps: ['Cook the pasta and keep ½ cup of the cooking water.', 'Sear the sliced chicken, then remove it.', 'Fry the mushrooms and garlic. Add the milk and a splash of pasta water.', 'Wilt in the spinach, then toss with the pasta and chicken.'],
  },

  // ---------- Vegetable dishes ----------
  {
    id: 'garlic_bok_choy', name: 'Garlic bok choy', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { bok_choy: 400, garlic: 10, oyster_sauce: 10 },
    steps: ['Halve the bok choy and wash out any grit.', 'Fry the garlic, add the bok choy, and stir-fry on high heat for 2 minutes.', 'Season with oyster sauce and a splash of water.'],
  },
  {
    id: 'garlic_spinach', name: 'Garlic spinach', kind: 'veg', cuisine: 'Chinese', minutes: 5, retired: true,
    items: { spinach: 350, garlic: 10 },
    steps: ['Wash and drain the spinach.', 'Fry the garlic, add the spinach, and toss until just wilted.', 'Season with salt.'],
  },
  {
    id: 'cabbage_stir_fry', name: 'Sour cabbage stir-fry', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { cabbage: 400, garlic: 10, vinegar: 15 },
    steps: ['Tear the cabbage into pieces.', 'Stir-fry with garlic on high heat for 3 minutes.', 'Add vinegar, salt and a pinch of sugar.'],
  },
  {
    id: 'smashed_cucumber', name: 'Smashed cucumber salad', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { cucumber: 350, garlic: 10, vinegar: 15, soy_sauce: 10 },
    steps: ['Smash the cucumbers with a knife and cut them into chunks. Salt for 10 minutes, then drain.', 'Toss with minced garlic, vinegar, soy sauce, sesame oil and chili oil.'],
  },
  {
    id: 'garlic_broccoli', name: 'Garlic broccoli', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { broccoli: 350, garlic: 10 },
    steps: ['Blanch the florets for 1 minute.', 'Stir-fry with garlic for 1 minute, and season with salt.'],
  },
  {
    id: 'tomato_cucumber_salad', name: 'Tomato & cucumber salad', kind: 'veg', cuisine: 'Western', minutes: 10,
    items: { tomato: 200, cucumber: 200, olive_oil: 15, lemon: 15 },
    steps: ['Chop the tomatoes and cucumber.', 'Dress with olive oil, lemon, salt and pepper.'],
  },
  {
    id: 'potato_shreds', name: 'Hot & sour potato shreds with pepper', kind: 'veg', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { potato: 300, bell_pepper: 100, garlic: 5, vinegar: 15 },
    steps: ['Cut the potatoes into matchsticks and rinse off the starch.', 'Stir-fry with garlic and sliced pepper on high heat for 3 minutes.', 'Add vinegar and salt. They should stay crunchy.'],
  },
  {
    id: 'bok_choy_mushroom', name: 'Bok choy with mushrooms', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { bok_choy: 300, mushroom: 150, garlic: 5, oyster_sauce: 15 },
    steps: ['Blanch the bok choy and arrange it on a plate.', 'Fry the sliced mushrooms with garlic until browned.', 'Add oyster sauce and a splash of water, and pour over the bok choy.'],
  },
  {
    id: 'napa_vinegar', name: 'Vinegar-glazed napa cabbage', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { napa: 400, garlic: 10, vinegar: 15, soy_sauce: 10 },
    steps: ['Slice the napa, keeping the stems and leaves separate.', 'Stir-fry the stems with garlic for 2 minutes, then add the leaves.', 'Finish with vinegar, soy sauce and a pinch of sugar.'],
  },
  {
    id: 'garlic_green_beans', name: 'Garlic green beans', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { green_beans: 350, garlic: 10 },
    steps: ['Blanch the beans for 2 minutes.', 'Stir-fry with garlic and salt for 2 minutes.'],
  },
  {
    id: 'braised_eggplant', name: 'Garlic braised eggplant', kind: 'veg', cuisine: 'Chinese', minutes: 20, retired: true,
    items: { eggplant: 400, garlic: 15, scallion: 10, soy_sauce: 15 },
    steps: ['Cut the eggplant into batons and pan-fry until soft.', 'Add the garlic, soy sauce, 1 tsp sugar and a splash of water.', 'Simmer for 2 minutes and top with scallions.'],
  },
  {
    id: 'zucchini_eggs', name: 'Zucchini with eggs', kind: 'veg', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { zucchini: 300, eggs: 100, garlic: 5 },
    steps: ['Scramble the eggs and set them aside.', 'Stir-fry the sliced zucchini with garlic until tender.', 'Return the eggs and season with salt.'],
  },
  {
    id: 'cabbage_carrot_slaw', name: 'Cabbage & carrot slaw', kind: 'veg', cuisine: 'Western', minutes: 10,
    items: { cabbage: 250, carrot: 150, olive_oil: 15, lemon: 15, vinegar: 10 },
    steps: ['Finely shred the cabbage and grate the carrots.', 'Toss with olive oil, lemon, vinegar, salt and a pinch of sugar. It keeps for 3 days.'],
  },
  {
    id: 'celery_carrot_tofu', name: 'Celery, carrot & tofu stir-fry', kind: 'veg', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { celery: 200, carrot: 100, tofu: 150, garlic: 5, soy_sauce: 10 },
    steps: ['Slice the tofu into strips and pan-fry until golden.', 'Stir-fry the celery and carrot with garlic for 2 minutes.', 'Return the tofu and season with soy sauce.'],
  },
  {
    id: 'roasted_veg', name: 'Roasted zucchini, peppers & mushrooms', kind: 'veg', cuisine: 'Western', minutes: 30,
    items: { zucchini: 200, bell_pepper: 150, onion: 100, mushroom: 100, olive_oil: 15 },
    steps: ['Heat the oven to 220°C / 425°F.', 'Toss the chunks of vegetables with oil and salt.', 'Roast for 20–25 minutes until charred at the edges.'],
  },

  // ---------- Soups ----------
  {
    id: 'tomato_egg_soup', name: 'Tomato egg-drop soup', kind: 'soup', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { tomato: 200, eggs: 100, scallion: 10, cornstarch: 5 },
    steps: ['Fry the tomato wedges until soft, then add 3 cups water and boil.', 'Thicken lightly with cornstarch slurry.', 'Drizzle in the beaten eggs while stirring slowly. Season and top with scallions.'],
  },
  {
    id: 'napa_tofu_soup', name: 'Napa cabbage & tofu soup', kind: 'soup', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { napa: 200, tofu: 200, ginger: 5 },
    steps: ['Boil 3 cups water with ginger slices.', 'Add the sliced napa and cubed tofu, and simmer for 8 minutes.', 'Season with salt and white pepper.'],
  },
  {
    id: 'mushroom_soup', name: 'Creamy mushroom soup', kind: 'soup', cuisine: 'Western', minutes: 25,
    items: { mushroom: 200, onion: 100, milk: 200, garlic: 5 },
    steps: ['Soften the onion and garlic in butter or oil, then add the sliced mushrooms and cook until browned.', 'Add 1 cup water and simmer for 10 minutes.', 'Add the milk, blend half of the soup, and season.'],
  },
  {
    id: 'spinach_egg_soup', name: 'Spinach & egg soup', kind: 'soup', cuisine: 'Chinese', minutes: 10, retired: true,
    items: { spinach: 150, eggs: 100, ginger: 5 },
    steps: ['Boil 3 cups water with ginger.', 'Add the spinach and cook for 1 minute.', 'Drizzle in the beaten eggs and season.'],
  },
  {
    id: 'borscht', name: 'Chinese-style borscht (luó sòng tāng)', kind: 'soup', cuisine: 'Chinese', minutes: 75, retired: true,
    items: { beef: 150, cabbage: 200, tomato: 200, carrot: 100, potato: 150, onion: 100 },
    steps: ['Simmer the cubed beef in 5 cups water for 40 minutes.', 'Fry the onion and tomato into a paste, then add it to the pot.', 'Add the carrot, potato and cabbage, and simmer for 25 minutes.', 'Season with salt and pepper. It tastes even better the next day.'],
  },
  // ---------- Saturday one-pot lunches ----------
  {
    id: 'egg_fried_rice', name: 'Egg fried rice with carrot & cabbage', kind: 'onepot', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { eggs: 150, carrot: 100, cabbage: 150, scallion: 15, rice: 400, soy_sauce: 15 },
    steps: ['Use day-old cooked rice. Dice the carrot and shred the cabbage.', 'Scramble the eggs and set them aside.', 'Stir-fry the carrot and cabbage for 2 minutes, then add the rice and toss on high heat.', 'Return the eggs, season with soy sauce and salt, and finish with scallions.'],
  },
  {
    id: 'cabbage_fried_noodles', name: 'Pork, cabbage & carrot fried noodles', kind: 'onepot', cuisine: 'Chinese', minutes: 20, retired: true,
    items: { pork: 120, cabbage: 200, carrot: 80, noodles: 250, soy_sauce: 20, oyster_sauce: 10 },
    steps: ['Cook the noodles until just tender, then drain and toss with a little oil.', 'Stir-fry the sliced pork until browned.', 'Add the shredded cabbage and carrot, and cook for 2 minutes.', 'Add the noodles, soy sauce and oyster sauce, and toss on high heat.'],
  },
  {
    id: 'napa_egg_noodle_soup', name: 'Napa, tofu & egg noodle soup', kind: 'onepot', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { napa: 200, tofu: 150, eggs: 100, noodles: 200, ginger: 5, scallion: 10 },
    steps: ['Boil 4 cups water with ginger slices.', 'Add the noodles, sliced napa and cubed tofu, and simmer for 5 minutes.', 'Crack in the eggs and poach for 3 minutes.', 'Season with soy sauce and salt, and top with scallions.'],
  },
  {
    id: 'tomato_egg_noodles', name: 'Tomato & egg noodles', kind: 'onepot', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { tomato: 250, eggs: 150, noodles: 250, scallion: 10 },
    steps: ['Scramble the eggs and set them aside.', 'Cook the tomato wedges into a sauce with 1 tsp sugar and 1 cup water.', 'Add the cooked noodles and eggs, and toss.', 'Season and top with scallions.'],
  },
  {
    id: 'beef_noodle_soup', name: 'Beef & napa noodle soup', kind: 'onepot', cuisine: 'Chinese', minutes: 25, retired: true,
    items: { beef: 150, napa: 150, noodles: 250, ginger: 5, scallion: 10, soy_sauce: 20 },
    steps: ['Slice the beef thin.', 'Boil 4 cups water with ginger and soy sauce, then add the noodles and napa.', 'Add the beef for the last minute only, so it stays tender.', 'Top with scallions.'],
  },
  {
    id: 'celery_tofu_fried_rice', name: 'Celery, tofu & egg fried rice', kind: 'onepot', cuisine: 'Chinese', minutes: 15, retired: true,
    items: { celery: 120, tofu: 150, eggs: 100, onion: 80, rice: 400, soy_sauce: 15 },
    steps: ['Dice the celery, onion and tofu. Use day-old cooked rice.', 'Scramble the eggs and set them aside.', 'Fry the tofu until golden, then add the onion and celery.', 'Add the rice and eggs, and season with soy sauce.'],
  },

  // ---------- HowToCook 程序员做饭指南 (github.com/Anduin2017/HowToCook, Unlicense) ----------
  // Amounts are scaled to one meal for two. `{id}` in a step shows that ingredient's amount for this batch, `{id/2}` half of it.

  // Mains
  {
    id: 'ribs_potato', zh: '土豆炖排骨', name: 'Braised pork ribs with potatoes', kind: 'main', cuisine: 'Chinese', minutes: 100, cookAhead: true, source: htc('meat_dish/土豆炖排骨/土豆炖排骨'),
    items: { pork_ribs: 500, potato: 250, ginger: 20, scallion: 15, cooking_wine: 15, sugar: 7, dried_chili: 3, star_anise: 1, sichuan_pepper: 1, spices: 1, soy_sauce: 7, dark_soy: 3, oyster_sauce: 3, bean_paste: 3, salt: 2, oil: 15 },
    steps: [
      '土豆去皮切滚刀块，切好立刻泡进清水防氧化。姜切片，一半葱打成葱结、一半切葱花。',
      '酱汁碗：{soy_sauce} 生抽、{dark_soy} 老抽、{oyster_sauce} 蚝油、{bean_paste} 黄豆酱拌匀。香料碟：{dried_chili} 干辣椒、{star_anise} 八角、{sichuan_pepper} 花椒、{spices} 桂皮和一半姜片。烧一壶开水。',
      '排骨冷水下锅，加葱结、另一半姜片和 {cooking_wine/2} 料酒，煮沸后再煮 2 分钟。捞出用热水（不要用冷水）洗净浮沫，再用厨房纸彻底吸干，防止下锅溅油。',
      '锅里放 {oil} 油和 {sugar} 白糖，中小火不停搅拌，炒到糖冒泡、呈红棕色，立刻下排骨，中大火煎 2–3 分钟，让排骨均匀裹上糖色。',
      '拨开一块空地倒入香料碟爆香 10 秒，沿锅边淋入剩下的料酒，倒入酱汁碗翻炒 30 秒。',
      '加开水没过排骨，大火烧开后盖盖转小火炖 40 分钟。下沥干的土豆再炖 15–20 分钟，筷子能扎透即可。',
      '加 {salt} 盐，开大火收汁 3–5 分钟，到汤汁浓稠挂在排骨上，撒葱花出锅。',
    ],
  },
  {
    id: 'sweet_sour_ribs', zh: '糖醋排骨', name: 'Sweet and sour pork ribs', kind: 'main', cuisine: 'Chinese', minutes: 45, cookAhead: true, source: htc('meat_dish/糖醋排骨/糖醋排骨'),
    items: { pork_ribs: 500, sugar: 50, soy_sauce: 8, oyster_sauce: 8, dark_soy: 8, ginger: 5, sesame: 3, ketchup: 15, vinegar: 8, five_spice: 1 },
    steps: [
      '排骨和姜片冷水下锅，大火煮到出现大量浮沫，转小火再焯 2–3 分钟。捞出用开水反复冲洗 2–3 遍，沥干。',
      '锅中倒较多的油（能没过排骨 2/3），油温约 170°C 时下排骨炸 3–5 分钟，到表面略呈金黄，捞出控油。',
      '另取干净锅，小火加热 50 ml 热水和 {sugar} 白糖，轻轻搅拌到糖完全溶化、略呈淡黄色。',
      '倒入排骨快速翻炒 30 秒，依次加 {vinegar} 香醋、{soy_sauce} 生抽、{oyster_sauce} 蚝油、{ketchup} 番茄酱和 {five_spice} 五香粉，再翻炒 30 秒，加开水刚好没过排骨。',
      '大火烧开后加 {dark_soy} 老抽上色，快速收汁。排骨块大可以小火焖 5–10 分钟，但不要中火久炖，会柴。',
      '出锅装盘，撒上 {sesame} 芝麻。',
    ],
  },
  {
    id: 'hunan_braised_pork', zh: '湖南家常红烧肉', name: 'Hunan red-braised pork belly', kind: 'main', cuisine: 'Chinese', minutes: 60, cookAhead: true, source: htc('meat_dish/湖南家常红烧肉/湖南家常红烧肉'),
    items: { pork_belly: 500, oil: 10, spices: 2, ginger: 10, rock_sugar: 25, cooking_wine: 20, soy_sauce: 5, dark_soy: 2, salt: 2, star_anise: 2, dried_chili: 3 },
    steps: [
      '带皮五花肉冷水下锅，加 2–3 片姜，煮到沸腾后捞出，用冷水冲净浮沫，切成 1.5 cm 见方的块。',
      '热锅加 {oil} 油和 {rock_sugar} 冰糖，小火搅拌到焦糖色，下五花肉中火翻炒上色。',
      '加剩下的姜片、{star_anise} 八角、{spices} 桂皮香叶、{dried_chili} 干辣椒、{soy_sauce} 生抽、{dark_soy} 老抽、{cooking_wine} 料酒和 {salt} 盐，小火翻炒 1 分钟，加开水没过肉。',
      '盖盖中火煮沸，转小火慢炖 30 分钟，每隔 10 分钟搅一次防止粘锅。',
      '汤汁剩三分之一时转中火收汁出锅。',
    ],
  },
  {
    id: 'tomato_potato_beef', zh: '西红柿土豆炖牛肉', name: 'Beef stewed with tomatoes and potatoes', kind: 'main', cuisine: 'Chinese', minutes: 100, cookAhead: true, source: htc('meat_dish/西红柿土豆炖牛肉/西红柿土豆炖牛肉'),
    items: { beef: 400, potato: 300, tomato: 300, onion: 150, scallion: 15, ginger: 10, cooking_wine: 35, sichuan_pepper: 3, star_anise: 1, spices: 1, oil: 15, sugar: 5, soy_sauce: 15, dark_soy: 3, black_pepper: 2, ketchup: 10, salt: 3 },
    steps: [
      '土豆去皮切 5 cm 大块；西红柿划十字，开水烫后去皮去芯切块；洋葱切小粒；葱切段，留一点葱花。',
      '牛肉凉水下锅煮到表面变白，撇去浮沫。再加凉水没过牛肉放入高压锅，加葱段、姜片和 {cooking_wine/2} 料酒，上汽压 20 分钟（普通锅约炖 1 小时）。牛肉切 5 cm 块，汤留着。',
      '锅中 {oil} 油烧到四五成热，下 {sichuan_pepper} 花椒、{star_anise} 八角、{spices} 香叶炸香，糊之前捞出不用。下牛肉和葱姜炒香，快糊时舀一勺汤。',
      '加 {soy_sauce} 生抽、{dark_soy} 老抽、剩下的料酒、{black_pepper} 黑胡椒和 {ketchup} 番茄酱，下洋葱炒到透明，再下西红柿炒到化开软烂，倒入全部牛肉汤。',
      '中火烧开后全程小火。出锅前 30–40 分钟加土豆，用 {sugar} 糖和 {salt} 盐边尝边调，炖到筷子能戳透牛肉即可。',
    ],
  },
  {
    id: 'beef_daikon', zh: '广式萝卜牛腩', name: 'Cantonese beef brisket with daikon', kind: 'main', cuisine: 'Chinese', minutes: 150, cookAhead: true, source: htc('meat_dish/广式萝卜牛腩/广式萝卜牛腩'),
    items: { beef: 350, daikon: 400, ginger: 20, garlic: 15, scallion: 15, star_anise: 1, spices: 2, dried_chili: 2, bean_paste: 20, oyster_sauce: 10, soy_sauce: 10, rock_sugar: 7, salt: 3, dark_soy: 10, oil: 15 },
    steps: [
      '白萝卜去皮切滚刀块。牛腩整块冷水下锅，加 2 片姜和一把葱结，水开后再煮 5–10 分钟，捞出切块。',
      '调酱：{bean_paste} 柱侯酱（或黄豆酱，有南乳加 1 块）、{soy_sauce} 酱油、{oyster_sauce} 蚝油、{rock_sugar} 冰糖和 {salt} 盐拌匀。',
      '热锅下 {oil} 油爆香姜片和蒜瓣，下牛腩炒到干身，加酱料炒香，再加 {dark_soy} 老抽上色。',
      '倒热水没过牛腩，放 {spices} 桂皮香叶、{star_anise} 八角和 {dried_chili} 干辣椒，小火焖约 2 小时（高压锅约 35 分钟）。',
      '牛腩半软时加白萝卜继续焖 30 分钟，萝卜软透即可。',
    ],
  },
  {
    id: 'huangmen_chicken', zh: '黄焖鸡', name: 'Braised chicken with mushrooms and peppers', kind: 'main', cuisine: 'Chinese', minutes: 40, cookAhead: true, source: htc('meat_dish/黄焖鸡'),
    items: { chicken_thigh: 450, mushroom: 80, green_pepper: 120, potato: 200, ginger: 5, dried_chili: 3, salt: 6, cooking_wine: 10, white_pepper: 2, sugar: 5, soy_sauce: 5, oil: 15 },
    steps: [
      '鸡腿剁成 4 cm 的块；姜切片，干辣椒切小圈；香菇切片（干香菇洗净提前泡一晚，香菇水留着）；青椒切长条；土豆切滚刀块。',
      '炒糖色：锅里放 {oil} 油，冷油时放 {sugar} 白糖，小火不停搅拌到深棕色（新手可跳过，后面用一点老抽代替）。',
      '迅速倒入鸡块，大火快炒上色，烹入 {cooking_wine} 料酒，下姜片和 {dried_chili} 干辣椒，再加 {soy_sauce} 酱油炒匀。',
      '倒入香菇水或清水没过鸡肉，加香菇、土豆、{white_pepper} 白胡椒粉和 {salt} 盐，翻匀后盖盖，中小火焖 15–20 分钟（有砂锅更好）。',
      '鸡肉软烂、汤汁浓稠（不要收太干）时放青椒，兜炒到青椒刚断生就关火。',
    ],
  },
  {
    id: 'dapanji', zh: '新疆大盘鸡', name: 'Xinjiang big-plate chicken', kind: 'main', cuisine: 'Chinese', minutes: 60, cookAhead: true, source: htc('meat_dish/新疆大盘鸡/新疆大盘鸡'),
    items: { chicken_thigh: 600, potato: 500, scallion: 60, bell_pepper: 50, green_pepper: 50, sugar: 20, dried_chili: 5, garlic: 15, oil: 30, sichuan_pepper: 2, spices: 1, salt: 5, soy_sauce: 7, oyster_sauce: 10, cooking_wine: 100 },
    steps: [
      '鸡肉剁块，用清水加一点盐泡 5 分钟去血水，沥干。土豆去皮切 4 cm 滚刀块，葱白切 4 cm 段，青椒、彩椒和干辣椒切块。',
      '炒糖色：锅里放 {oil} 油和 {sugar} 白糖，来回搅到糖化开、炒出焦黄色，倒入鸡肉翻炒上色。',
      '加 {sichuan_pepper} 花椒、{spices} 香叶、{dried_chili} 干辣椒和蒜瓣炒香，再加 {salt} 盐、{soy_sauce} 生抽、{oyster_sauce} 蚝油、{cooking_wine} 料酒（可用啤酒）和约 1 升清水。',
      '中火烧开后转中小火慢炖。水收到鸡肉快露出来时，把土豆铺在表面（不要翻，否则容易粘锅），盖盖继续炖。',
      '炖一会儿后放葱段和青椒、彩椒，汤汁收得差不多时翻匀，让土豆吸满汤汁，关火盛出。',
    ],
  },
  {
    id: 'mushroom_chicken', zh: '香菇滑鸡', name: 'Silky chicken with shiitake', kind: 'main', cuisine: 'Chinese', minutes: 30, cookAhead: true, source: htc('meat_dish/香菇滑鸡/香菇滑鸡'),
    items: { chicken_thigh: 400, mushroom: 100, ginger: 5, scallion: 10, garlic: 8, cooking_wine: 15, soy_sauce: 45, salt: 2, dark_soy: 15, sugar: 15, sesame_oil: 5 },
    steps: [
      '干香菇用 150 ml 温水泡发，每朵切四块，香菇水留着（用鲜香菇就准备 150 ml 清水）。姜切小块，葱切段，蒜切小粒，鸡腿去骨切小块。',
      '鸡肉焯水 1 分钟去血沫，加 {cooking_wine} 料酒、{soy_sauce/3} 生抽、{salt} 盐和 {dark_soy} 老抽抓匀。',
      '油温三成热时下鸡肉煸炒，到鸡肉金黄后盛出。',
      '锅留底油，下葱姜蒜炒香，下香菇大火翻匀，约 20 秒后会飘出香菇香味。',
      '倒回鸡肉，加入全部香菇水（灵魂操作）、{sugar} 糖和剩下的生抽。',
      '中火不盖盖煮 2 分钟收浓汤汁，淋 {sesame_oil} 香油，撒葱花出锅。',
    ],
  },
  {
    id: 'cola_wings', zh: '可乐鸡翅', name: 'Cola chicken wings', kind: 'main', cuisine: 'Chinese', minutes: 35, cookAhead: true, source: htc('meat_dish/可乐鸡翅'),
    items: { chicken_wings: 500, cola: 500, sugar: 10, soy_sauce: 15, dark_soy: 3, salt: 2, ginger: 5, cooking_wine: 20, scallion: 15 },
    steps: [
      '鸡翅冷水下锅，加 1 片姜和 {cooking_wine} 料酒，大火煮开约 2 分钟，撇去浮沫，捞出沥干（新鲜鸡翅可跳过这步）。',
      '鸡翅两面各划两刀，用 {soy_sauce/2} 生抽腌 10 分钟。',
      '小火起油，爆香剩下的姜片，下鸡翅煎到两面金黄，和姜片一起翻炒几下防粘。',
      '倒入 {cola} 可乐没过鸡翅，大火煮沸，撇去黑色浮沫，放葱结，加 {salt} 盐、{sugar} 白糖、剩下的生抽和 {dark_soy} 老抽。',
      '葱结变黄后和姜片一起捞出，转中火慢煮，到可乐汁浓稠挂丝时转小火，让汁牢牢裹在鸡翅上出锅。',
    ],
  },
  {
    id: 'braised_wings', zh: '红烧鸡翅', name: 'Red-braised chicken wings', kind: 'main', cuisine: 'Chinese', minutes: 35, cookAhead: true, source: htc('meat_dish/红烧鸡翅'),
    items: { chicken_wings: 500, ginger: 10, scallion: 20, garlic: 15, spices: 1, star_anise: 1, dried_chili: 5, rock_sugar: 15, cooking_wine: 35, soy_sauce: 15, dark_soy: 5, salt: 3, sugar: 2, white_pepper: 1, sesame: 3, oil: 12 },
    steps: [
      '鸡翅洗净，正面划三刀、背面扎一刀，方便入味。大蒜拍散，香料备好。',
      '鸡翅冷水下锅，加 {cooking_wine/2} 料酒和 2 片姜，大火烧开后再煮 2–3 分钟，撇去浮沫。捞出用温水洗 2 遍，控干。',
      '另起锅放 {oil} 油，五成热时加 {rock_sugar} 冰糖，大火熬到融化变色后转小火，炒到枣红色立刻下鸡翅，快速翻炒 1–2 分钟裹上糖色。',
      '加 {spices} 香叶、{star_anise} 八角、{dried_chili} 干辣椒、剩下的姜片、葱段和蒜，煸炒 30 秒出香。沿锅边淋入剩下的料酒和 {soy_sauce} 生抽，快炒 10 秒。',
      '加温水稍微没过鸡翅，加 {dark_soy} 老抽、{salt} 盐、{sugar} 白糖和 {white_pepper} 胡椒粉拌匀，盖盖中火烧 7–8 分钟。',
      '捡出香料和葱姜蒜，转大火不停翻炒 1–2 分钟，把汤汁烧到粘稠。盛出淋上汤汁，撒 {sesame} 白芝麻和葱花。',
    ],
  },
  {
    id: 'htc_kung_pao', zh: '宫保鸡丁', name: 'Kung pao chicken', kind: 'main', cuisine: 'Chinese', minutes: 30, cookAhead: true, source: htc('meat_dish/宫保鸡丁/宫保鸡丁'),
    items: { chicken_thigh: 350, scallion: 120, peanuts: 100, ginger: 10, dried_chili: 10, soy_sauce: 10, sugar: 2, salt: 2, oil: 20, cornstarch: 25, cooking_wine: 15, dark_soy: 5, sichuan_pepper: 5, vinegar: 5, sesame_oil: 10 },
    steps: [
      '鸡腿去骨，用刀背拍松，切成 1.5 cm 见方的丁，泡清水 10 分钟后控干。葱绿和 5 g 姜片放碗里，倒 50 g 开水做葱姜水；葱白切 1.5 cm 的粒。',
      '鸡丁加 {salt} 盐、{dark_soy} 老抽、{cooking_wine} 料酒和 {cornstarch/2} 淀粉拌到微微发干，再慢慢加部分葱姜水拌到粘手，盖保鲜膜冷藏腌 1 小时。',
      '花生用微波炉高火 5 分钟焙干。干锅烧热转小火，把切段的 {dried_chili} 干辣椒焙到微微发糊、{sichuan_pepper} 花椒焙出香味，分别捞出。',
      '转大火倒入 {oil} 油，七成热（筷子起泡）时下鸡丁，煎到底面发白再翻面，30 秒后翻炒均匀。',
      '下葱粒翻炒，加剩下的葱姜水（不够 100 g 就补热水），盖盖中小火焖 2 分钟。',
      '转大火，下花生、干辣椒和花椒，加 {soy_sauce} 生抽、{vinegar} 香醋和 {sugar} 白糖翻匀。剩下的淀粉加 50 g 水调成水淀粉倒入，收汁到喜欢的浓度。',
      '关火淋 {sesame_oil} 芝麻油出锅。',
    ],
  },
  {
    id: 'yuxiang_pork', zh: '鱼香肉丝', name: 'Fish-fragrant shredded pork', kind: 'main', cuisine: 'Chinese', minutes: 30, cookAhead: true, source: htc('meat_dish/鱼香肉丝'),
    items: { pork: 250, carrot: 80, green_pepper: 80, wood_ear: 5, eggs: 30, soy_sauce: 10, cooking_wine: 5, cornstarch: 10, vinegar: 15, sugar: 10, salt: 1, doubanjiang: 15, garlic: 10, ginger: 5, scallion: 10, oil: 20 },
    steps: [
      '干木耳提前泡 4 小时，洗净切小块。青椒、胡萝卜切丝，胡萝卜丝焯水。姜蒜切末，葱切 5 mm 小段。',
      '腌料：{soy_sauce/2} 生抽、{cooking_wine} 料酒、{cornstarch/2} 淀粉、20 ml 水和 1 个蛋清混合。里脊切丝，用腌料抓匀腌 15–30 分钟。',
      '鱼香汁：剩下的生抽、{vinegar} 醋、{sugar} 白糖、{salt} 盐、剩下的淀粉和 20 ml 水调匀。',
      '锅烧热放 15 ml 油，倒入肉丝快速滑散到变白，盛出。',
      '再放 5 ml 油，下葱姜蒜和 {doubanjiang} 豆瓣酱炒出红油，下胡萝卜炒 20 秒，再下青椒和木耳炒 2 分钟。',
      '倒回肉丝快速翻匀（不超过 20 秒），倒入鱼香汁快速翻匀（不超过 15 秒），关火盛盘。',
    ],
  },
  {
    id: 'pork_potato_pepper', zh: '青椒土豆炒肉', name: 'Pork with green peppers and potatoes', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true, source: htc('meat_dish/青椒土豆炒肉/青椒土豆炒肉'),
    items: { pork: 200, potato: 300, green_pepper: 200, scallion: 10, ginger: 5, garlic: 12, salt: 5, soy_sauce: 8, oil: 15, cornstarch: 5 },
    steps: [
      '青椒去蒂切小块，土豆去皮切 2 mm 薄片，猪肉切 4 mm 薄片，葱切 3 mm 小段，姜蒜拍散剁末。{cornstarch} 淀粉加 15 g 水调成水淀粉。',
      '起锅烧 {oil} 油到七成热，下肉片翻炒到不见红色，加 {soy_sauce/3} 酱油炒匀上色，放 {salt/2} 盐。',
      '转五成油温，下葱姜蒜炒 5 秒，加土豆片转七成油温翻炒，加剩下的酱油和盐，炒到土豆断生、表面微微焦黄。',
      '转大火下青椒，煸出锅气（冒白烟），翻炒 1 分钟，沿锅边倒入水淀粉勾芡，汤汁粘稠后关火盛盘。',
    ],
  },
  {
    id: 'celery_tofu_pork', zh: '香干芹菜炒肉', name: 'Pork with celery and pressed tofu', kind: 'main', cuisine: 'Chinese', minutes: 15, cookAhead: true, source: htc('meat_dish/香干芹菜炒肉/香干芹菜炒肉'),
    items: { pork: 200, dried_tofu: 150, celery: 200, garlic: 8, chili: 20, sichuan_pepper: 1, salt: 5, dark_soy: 8, oyster_sauce: 5, oil: 15 },
    steps: [
      '芹菜去叶切成不超过 4 cm 的段，香干切成小指宽的条，蒜切片，辣椒切圈，猪肉切丝或片。',
      '热锅放 {oil} 油，等 10 秒油热，下 {sichuan_pepper} 花椒（约 6 粒）和蒜爆香（能吃姜的可以加几片）。',
      '下猪肉炒到变色，加 {dark_soy} 老抽上色翻匀（有豆瓣酱可以加 3 ml 一起炒）。',
      '下香干翻炒约 2 分钟，下辣椒炒 1–2 分钟，下芹菜和 {salt} 盐炒 1 分钟。',
      '加 {oyster_sauce} 蚝油（有鸡精加 3 g）翻匀出锅。',
    ],
  },
  {
    id: 'pork_dried_tofu', zh: '香干肉丝', name: 'Shredded pork with pressed tofu and peppers', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true, source: htc('meat_dish/香干肉丝'),
    items: { pork: 200, dried_tofu: 150, green_pepper: 200, salt: 6, soy_sauce: 10, cornstarch: 10, garlic: 10, oil: 15 },
    steps: [
      '肉切丝，用 {soy_sauce/2} 生抽和 {cornstarch/2} 淀粉抓匀。青椒滚刀切块，大蒜切片，香干切丝。剩下的淀粉加 10 ml 水调匀。',
      '干净锅放 {oil} 油，不用等油热就倒入肉丝慢慢划散，肉丝一熟立刻捞出，油留在锅里。',
      '下蒜片和香干，加剩下的生抽翻炒 2–3 分钟。',
      '放入青椒翻炒 1 分钟，倒回肉丝炒匀。',
      '倒入水淀粉勾芡，加 {salt} 盐（有鸡精加 2 g），翻炒 2–3 分钟出锅。',
    ],
  },
  {
    id: 'htc_mapo_tofu', zh: '麻婆豆腐', name: 'Mapo tofu', kind: 'main', cuisine: 'Chinese', minutes: 25, cookAhead: true, source: htc('meat_dish/麻婆豆腐/麻婆豆腐'),
    items: { tofu: 400, pork_mince: 60, garlic: 8, ginger: 5, chili: 20, doubanjiang: 10, sichuan_pepper: 1, salt: 3, soy_sauce: 10, oil: 12 },
    steps: [
      '大蒜和姜切碎，小米辣切圈。肉末加 {salt/2} 盐和 {soy_sauce/2} 酱油拌匀。（原版还加 1 个咸鸭蛋：去掉蛋黄，蛋白捣成 2 mm 小粒，一起炒更鲜。）',
      '豆腐在盒子里划成约 2.5 × 3 cm 的块。',
      '热锅放 {oil} 油，等 10 秒油热，转小火下蒜、姜、辣椒圈、{sichuan_pepper} 花椒（约 20 粒）、咸鸭蛋白和 {doubanjiang} 辣酱，翻炒 20 秒出香。',
      '转中火下肉末，炒约 1 分钟到变色。转小火放豆腐，把剩下的盐和酱油均匀洒在豆腐上。',
      '从锅边倒开水没过豆腐（不然豆腐容易破），大火烧开后转中火煮约 10 分钟。',
      '水只剩 1/5、豆腐表面入色后关火盛盘。',
    ],
  },
  {
    id: 'napa_pork_noodles', zh: '白菜猪肉炖粉条', name: 'Napa cabbage, pork belly and glass noodle stew', kind: 'main', cuisine: 'Chinese', minutes: 40, cookAhead: true, source: htc('meat_dish/白菜猪肉炖粉条'),
    items: { pork_belly: 300, napa: 500, glass_noodles: 50, five_spice: 5, salt: 8, dark_soy: 5, soy_sauce: 5, oil: 12 },
    steps: [
      '先烧水，水开后下干粉条煮 5 分钟，连水倒进容器盖上盖子继续泡。',
      '五花肉切 3 mm 片。白菜嫩叶和白菜帮分开，各切成片。',
      '热锅放 {oil} 油，等 10 秒油热，下五花肉炒到变色，加 {dark_soy} 老抽炒 1 分钟上色。',
      '下白菜帮，加 {salt/2} 盐和 {soy_sauce} 生抽炒 1 分钟（粘锅就烹 10 ml 水）。',
      '加水没过所有食材，放 {five_spice} 十三香（有鸡精加 5 g），烧开后转小火炖 20 分钟。',
      '粉条沥水切段。下白菜叶炒匀，把粉条铺在菜上，盖盖再煮 5 分钟，尝味后用剩下的盐调整，收汁关火。',
    ],
  },
  {
    id: 'black_pepper_beef', zh: '黑椒牛柳', name: 'Black pepper beef', kind: 'main', cuisine: 'Chinese', minutes: 30, cookAhead: true, source: htc('meat_dish/黑椒牛柳/黑椒牛柳'),
    items: { beef: 300, onion: 100, bell_pepper: 100, soy_sauce: 10, oyster_sauce: 10, black_pepper: 4, cornstarch: 6, salt: 2, oil: 20 },
    steps: [
      '牛肉切条：长不超过 8 cm、厚 5–10 mm、宽约 1 cm。洋葱和彩椒切条。',
      '腌料：有现成黑椒腌料就按说明用；没有就用 {soy_sauce} 生抽、{oyster_sauce} 蚝油和 {black_pepper/2} 黑胡椒抓匀，腌 20 分钟以上（可以延长，不能缩短），最后拌入 {cornstarch} 淀粉再静置 20 分钟。',
      '热锅加 {oil} 油，看到油冒出一丝烟时下牛肉，中火偏大翻炒 2 分钟，到牛肉外表完全没有血色（小心溅油）。',
      '下洋葱和彩椒翻炒 2 分钟。',
      '加 {salt} 盐，再撒剩下的黑胡椒，翻炒 30 秒拌匀，洋葱变软就关火出锅。',
    ],
  },
  {
    id: 'htc_tomato_egg', zh: '西红柿炒鸡蛋', name: 'Tomato and egg stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 10, source: htc('vegetable_dish/西红柿炒鸡蛋'),
    items: { tomato: 360, eggs: 150, oil: 12, salt: 4, sugar: 2, scallion: 10 },
    steps: [
      '西红柿洗净（可以用开水烫一下，放进冷水后剥皮），去蒂，切成边长不超过 4 cm 的块。',
      '鸡蛋打进碗里，加 {salt/2} 盐搅匀。加 1 ml 醋能去腥，还能让鸡蛋更蓬松。',
      '热锅加 {oil} 油，油热后倒入蛋液，翻炒到鸡蛋凝固、颜色微微发黄，关火盛出（不要洗锅）。',
      '重新开火下西红柿，用锅铲拍打翻炒 20 秒，到西红柿软烂出汁（想要多点汤汁可以加 10 ml 番茄酱和 50 ml 清水）。',
      '倒回鸡蛋炒匀，加剩下的盐、{sugar} 糖（喜欢甜口）和葱花，翻匀出锅。',
    ],
  },
  {
    id: 'pork_egg_steam', zh: '肉饼炖蛋', name: 'Steamed pork patty with egg', kind: 'main', cuisine: 'Chinese', minutes: 20, source: htc('meat_dish/肉饼炖蛋'),
    items: { pork_mince: 300, eggs: 100, cooking_wine: 10, soy_sauce: 20, white_pepper: 3, sesame_oil: 12 },
    steps: [
      '碗里放猪肉末、{cooking_wine} 料酒、{soy_sauce} 生抽、{white_pepper} 白胡椒粉、1 个鸡蛋和 {sesame_oil} 芝麻香油，搅拌均匀。',
      '把肉末平铺在盘子里，中间用勺子挖一个洞，打入另 1 个鸡蛋。',
      '锅里加水到 1/4 高，水开后放入盘子，盖盖蒸 15 分钟。',
    ],
  },
  {
    id: 'htc_steamed_fish', zh: '清蒸鲈鱼', name: 'Steamed sea bass', kind: 'main', cuisine: 'Chinese', minutes: 25, source: htc('aquatic/清蒸鲈鱼/清蒸鲈鱼'),
    items: { fish: 500, scallion: 30, ginger: 20, oil: 12, soy_sauce: 15, cooking_wine: 12, salt: 8 },
    steps: [
      '姜切片再切丝；葱白切段、葱绿切丝，切好泡在冷水里。',
      '鲈鱼洗净，用厨房纸擦干，两面各划几刀，先用盐搓掉鱼身粘液，再用 {salt} 盐和 {cooking_wine} 料酒抹遍鱼身里外，腌 10 分钟以上。',
      '鱼肚里塞一半姜丝和葱白，鱼身上也撒一些。盘子上用筷子把鱼架空。',
      '水烧开后放入鱼，大火蒸 10 分钟（鱼片约 6–8 分钟）。',
      '鱼换到干净盘子，去掉姜葱，浇 {soy_sauce} 蒸鱼豉油（或生抽），铺上新的姜丝和葱丝，把 {oil} 油烧热淋在鱼身上。',
    ],
  },
  {
    id: 'htc_braised_fish', zh: '红烧鱼', name: 'Red-braised fish', kind: 'main', cuisine: 'Chinese', minutes: 25, source: htc('aquatic/红烧鱼'),
    items: { fish: 500, ginger: 10, garlic: 15, dried_chili: 3, chili: 10, scallion: 10, salt: 6, vinegar: 5, soy_sauce: 5, sugar: 10, oyster_sauce: 5, cooking_wine: 15, oil: 40 },
    steps: [
      '鱼两面划好花刀（不然鱼背容易夹生），用厨房纸擦干水分。姜切丝，蒜拍碎，干辣椒切碎。',
      '锅热后加 {oil} 油，放入擦干的鱼，小火晃动锅，用热油把鱼煎到一面金黄，翻面再煎另一面。',
      '下姜蒜和 {dried_chili} 干辣椒炒出香味，沿锅边倒入 {cooking_wine} 料酒（会冒大量油烟，注意安全），再加 {vinegar} 醋、{sugar} 白糖和 {soy_sauce} 酱油。',
      '加冷水刚好没过鱼，中火盖盖，约 1 分钟后把鱼翻面，再盖上。',
      '3–4 分钟后加 {salt} 盐、{chili} 小米辣和 {oyster_sauce} 蚝油，盖盖继续烧，中途再翻面。',
      '汤汁收到鱼背下面一点时转小火，撒葱花（喜欢可以加香菜），盖盖 20 秒后关火出锅。',
    ],
  },
  {
    id: 'bream_tofu', zh: '鳊鱼炖豆腐', name: 'Braised fish with tofu', kind: 'main', cuisine: 'Chinese', minutes: 30, source: htc('aquatic/鳊鱼炖豆腐/鳊鱼炖豆腐'),
    items: { fish: 450, tofu: 350, ginger: 10, scallion: 40, garlic: 15, dark_soy: 2, spices: 2, rock_sugar: 20, dried_chili: 4, cooking_wine: 5, soy_sauce: 4, salt: 6, star_anise: 1, oil: 10 },
    steps: [
      '鱼改刀，放姜片和 {cooking_wine} 料酒腌 5–10 分钟。老豆腐切块后泡在水里。',
      '锅里放 {oil} 油，可以撒点盐防粘。鱼用厨房纸擦干，两面都煎一下。',
      '把鱼推到锅边，空出地方下葱姜蒜、{dried_chili} 干辣椒、{star_anise} 八角和 {spices} 香叶桂皮炒出香味。',
      '加 {soy_sauce} 生抽、{dark_soy} 老抽和 {rock_sugar} 冰糖，倒约 400 ml 热水，和鱼齐平或略少。',
      '大火烧开后放豆腐，贴着锅边放，加 {salt} 盐，转小火烧 10–15 分钟，最后大火收点汁出锅。',
    ],
  },
  {
    id: 'braised_prawns', zh: '油焖大虾', name: 'Oil-braised prawns', kind: 'main', cuisine: 'Chinese', minutes: 25, source: htc('aquatic/油焖大虾/油焖大虾'),
    items: { shrimp: 400, sichuan_pepper: 5, scallion: 60, ginger: 20, cooking_wine: 40, salt: 4, rock_sugar: 15, oil: 40 },
    steps: [
      '带壳大虾剪掉虾枪、虾须和虾脚，挑出沙包，开背挑出虾线，洗净（只有去壳虾也能做，焖的时间减半）。',
      '炸葱油：油三成热时放 {sichuan_pepper} 花椒，油热后离火，放葱段和一半姜，葱稍微变黄就把油沥出来留用。',
      '锅里下油，虾摆放整齐，两面变色后轻轻按压虾头，压出虾油。',
      '放剩下的姜（切成细粒）、{cooking_wine} 黄酒、两小碗水、{salt} 盐和 {rock_sugar} 冰糖，大火烧开后转小火盖盖焖，中途不加水、不开盖。',
      '虾壳发亮、虾身弯曲时把虾捞出摆盘。汤汁过滤后倒回锅里，收到剩 1/4，加葱油，浇在虾上。',
    ],
  },

  // Vegetable dishes
  {
    id: 'shredded_cabbage', zh: '手撕包菜', name: 'Hand-torn cabbage with pork belly', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/手撕包菜/手撕包菜'),
    items: { cabbage: 500, pork_belly: 100, chili: 10, oil: 40, cooking_wine: 5, soy_sauce: 5, vinegar: 5, ginger: 5, garlic: 8, salt: 5 },
    steps: [
      '包菜对半切开，去掉中间白色的硬梗，用手撕成片，加一点盐清洗后沥干。五花肉切片洗净。姜、蒜、小米辣切好。',
      '锅里放 {oil/2} 油，倒入包菜大火炒 1 分钟，加 {salt} 盐再炒 2 分钟，盛出。',
      '再放剩下的油，下五花肉大火炒 1 分钟，下姜、蒜和 {chili} 小米辣炒 1 分钟。',
      '倒回包菜，加 {vinegar} 香醋、{cooking_wine} 料酒和 {soy_sauce} 生抽（有鸡精加 2 g），大火炒 2 分钟出锅。',
    ],
  },
  {
    id: 'hot_sour_potato', zh: '酸辣土豆丝', name: 'Hot and sour shredded potatoes', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/酸辣土豆丝'),
    items: { potato: 300, garlic: 15, green_pepper: 40, bell_pepper: 40, dried_chili: 3, scallion: 10, soy_sauce: 5, vinegar: 10, salt: 2, oil: 12 },
    steps: [
      '土豆去皮切细丝（越细越长越好，也可以用刨丝器），用清水洗去多余淀粉，再焯水 10 秒，沥干。',
      '葱切葱花，大蒜拍碎切末分成两份，干辣椒切小段，青红椒切丝。',
      '小火热 {oil} 油，下一半葱花（葱白部分）、一半蒜末和 {dried_chili} 干辣椒爆香。',
      '加青红椒翻炒几下，加土豆丝翻炒到变色。',
      '加 {soy_sauce} 生抽、{vinegar} 陈醋、剩下的蒜末和 {salt} 盐快速翻匀，撒剩下的葱花出锅。',
    ],
  },
  {
    id: 'di_san_xian', zh: '地三鲜', name: 'Eggplant, potato and pepper (di san xian)', kind: 'veg', cuisine: 'Chinese', minutes: 30, source: htc('vegetable_dish/地三鲜/地三鲜'),
    items: { eggplant: 200, potato: 150, green_pepper: 120, cornstarch: 8, scallion: 5, ginger: 5, garlic: 15, soy_sauce: 10, sugar: 10, doubanjiang: 15, oil: 180 },
    steps: [
      '茄子、土豆（去皮）都切成约 15 g 的不规则小块；尖椒顺着纹路撕成比它们稍大的块，用厨房纸擦干水分。',
      '调料碗：{soy_sauce} 生抽、{sugar} 糖、{cornstarch} 淀粉加 80 ml 清水搅匀。葱切小段，蒜剁成蓉分成两份，姜切末。',
      '热锅加 150 ml 油，下土豆煎炸 3–4 分钟，到金黄、筷子能轻松扎透，捞出；再下茄子炸 2–3 分钟，到变软、边缘微焦，捞出；最后下尖椒炸 15 秒，边缘起虎皮立刻捞出。倒出锅里的油。',
      '重新放 15 ml 底油，中小火爆香葱、姜和一半蒜蓉，下 {doubanjiang} 豆瓣酱，小火炒出红油和酱香。',
      '倒入调料碗，立刻转大火快速搅拌，约 10 秒冒泡变稠后，倒回土豆、茄子和尖椒翻炒 20 秒。',
      '关火拌入剩下的蒜蓉，盛盘。',
    ],
  },
  {
    id: 'stir_fried_eggplant', zh: '炒茄子', name: 'Soy-glazed eggplant with pork', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/炒茄子'),
    items: { eggplant: 500, pork_mince: 50, star_anise: 1, scallion: 15, soy_sauce: 30, sugar: 5, vinegar: 10, oil: 40 },
    steps: [
      '茄子竖着切成两段，再切菱形块；香葱切葱花，八角掰小。',
      '肉末用 10 ml 油中火炒约 1 分钟到变色，盛出。',
      '热锅烧干后倒较多的 {oil} 油（茄子吸油，油可以多加不能少加），六成热时下 {star_anise} 八角和葱花（有虾皮可以加一把）。',
      '油到九成热时倒入茄子翻炒约 40 秒，把 {soy_sauce} 酱油倒在悬空的锅铲上再淋下去（酱油宁少勿多）。',
      '茄子半软时倒回肉末拌匀，加 {sugar} 糖和 {vinegar} 醋，炒到所有茄子变色变软后出锅。',
    ],
  },
  {
    id: 'garlic_broccoli_sauce', zh: '蒜蓉西兰花', name: 'Broccoli with garlic sauce', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: htc('vegetable_dish/蒜蓉西兰花'),
    items: { broccoli: 300, garlic: 15, soy_sauce: 10, oyster_sauce: 5, sugar: 2, oil: 10 },
    steps: [
      '西兰花切成小朵洗净，大蒜去皮切末。',
      '锅里加 1 升水烧开，下西兰花大火煮 2–3 分钟，到颜色翠绿、口感变软，捞出沥干摆盘。',
      '热锅加 {oil} 油，油热后放蒜末小火煸出香味。',
      '加 {soy_sauce} 生抽、{oyster_sauce} 蚝油、{sugar} 白糖和 30 ml 水，烧开后把蒜蓉汁均匀淋在西兰花上。',
    ],
  },
  {
    id: 'dry_pot_cauliflower', zh: '干锅花菜', name: 'Dry-pot cauliflower with pork belly', kind: 'veg', cuisine: 'Chinese', minutes: 20, source: htc('vegetable_dish/干锅花菜/干锅花菜'),
    items: { cauliflower: 400, pork_belly: 100, chili: 15, soy_sauce: 10, sugar: 5, garlic: 15, salt: 2, oil: 10, scallion: 10 },
    steps: [
      '花菜朵朝下泡在淡盐水里 20 分钟，洗净后用小刀拆成小朵。开水焯 1 分钟，捞出立刻用冷水冲凉，沥干。',
      '五花肉切薄片，蒜用刀背拍扁，辣椒切段。',
      '锅烧热放 {oil} 油，油热下葱白爆香，下五花肉中火煸炒到全部变色，再多煸一会儿逼出部分油脂。',
      '下辣椒和花菜翻炒几下，加 {soy_sauce} 生抽、{sugar} 白糖和 {salt} 盐，转大火不停翻炒 1 分钟。',
      '放入蒜（有蒜苗切段一起放），翻几下后关火，盖盖焖 1 分钟出锅。',
    ],
  },
  {
    id: 'garlic_cauliflower', zh: '清炒花菜', name: 'Stir-fried cauliflower with garlic', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/清炒花菜'),
    items: { cauliflower: 400, garlic: 12, salt: 4, oil: 15 },
    steps: [
      '花菜洗净掰成小朵，粗茎切片；大蒜切片。',
      '锅里加 1 升水烧开，下花菜煮 2–3 分钟到颜色变浅、稍微变软，捞出沥干。',
      '热锅加 {oil} 油大火烧热，下蒜片快速煸香，倒入花菜中大火快炒约 2 分钟。',
      '加 {salt} 盐炒匀，沿锅边淋入 50 ml 水，盖盖焖 1 分钟，开盖翻匀出锅。',
    ],
  },
  {
    id: 'braised_green_beans', zh: '素炒豆角', name: 'Braised green beans', kind: 'veg', cuisine: 'Chinese', minutes: 20, source: htc('vegetable_dish/素炒豆角'),
    items: { green_beans: 250, chili: 10, scallion: 5, garlic: 8, soy_sauce: 6, dark_soy: 2, oyster_sauce: 6, salt: 5, oil: 12 },
    steps: [
      '葱切花，蒜切末，小米辣切圈。{soy_sauce} 生抽、{dark_soy} 老抽、{oyster_sauce} 蚝油和 {salt} 盐调成料汁。',
      '豆角去筋，45° 斜切成 4–10 cm 的段。',
      '起锅烧 {oil} 油，冒烟后放葱和小米辣炒香，加豆角翻炒 30 秒。',
      '加料汁大火翻炒 2 分钟，倒 150 ml 水，转中小火盖盖焖 8–10 分钟（豆角一定要焖熟）。',
      '撒蒜末出锅。',
    ],
  },
  {
    id: 'olive_veg_green_beans', zh: '榄菜肉末四季豆', name: 'Green beans with pork and olive greens', kind: 'veg', cuisine: 'Chinese', minutes: 20, source: htc('vegetable_dish/榄菜肉末四季豆/榄菜肉末四季豆'),
    items: { green_beans: 250, pork_belly: 100, olive_veg: 20, garlic: 10, chili: 10, soy_sauce: 2, salt: 2, white_pepper: 1, sugar: 1, oil: 10 },
    steps: [
      '四季豆洗净撕掉筋，切成大小均匀的粒。大蒜剁成末，小米辣切粒，五花肉去皮剁成肉末。',
      '锅烧热后加 20 ml 油滑锅，倒出热油再加 {oil} 冷油（热锅冷油防粘），下肉末小火煸炒两分钟，炒出猪油。',
      '肉末炒香后加蒜末、{olive_veg} 橄榄菜和 {chili} 小米辣炒出香味。',
      '加四季豆中火煸炒至少 5 分钟，一定要熟透，否则可能食物中毒。',
      '沿锅边淋入 {soy_sauce} 酱油，加 {salt} 盐、{white_pepper} 胡椒粉和 {sugar} 糖（有鸡精加 1 g），翻炒均匀出锅。',
    ],
  },
  {
    id: 'tiger_skin_peppers', zh: '虎皮青椒', name: 'Tiger-skin blistered peppers', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/虎皮青椒/虎皮青椒'),
    items: { green_pepper: 300, garlic: 10, oil: 20, sugar: 15, soy_sauce: 15, vinegar: 15, salt: 4 },
    steps: [
      '去掉青椒蒂，冲洗干净，每个纵向切成 3–4 条长片。大蒜去皮切成碎末。',
      '料 1：小碗里倒入 {oil} 油，放入蒜末。料 2：{sugar} 白糖、{soy_sauce} 生抽、{vinegar} 香醋和 {salt} 盐搅匀。',
      '把料 1 倒进锅里开火，五成热时放青椒，平铺不要叠在一起。',
      '用锅铲不停按压青椒，适时翻面，炒约 2 分钟到表皮起皱，倒入料 2，加大火翻炒 30 秒出锅。',
    ],
  },
  {
    id: 'stir_fried_greens', zh: '炒青菜', name: 'Stir-fried leafy greens', kind: 'veg', cuisine: 'Chinese', minutes: 8, source: htc('vegetable_dish/炒青菜'),
    items: { greens: 300, garlic: 15, oil: 12, salt: 4, sugar: 6 },
    steps: [
      '青菜掰成小瓣，用清水洗净；蒜瓣剁碎。',
      '中火或大火热锅，放 {oil} 油，再等 30 秒让油温升高。',
      '倒入青菜翻炒到变软（约 1 分钟），放蒜末。',
      '倒入约 200 ml 清水（快没过青菜），加 {salt} 盐继续翻炒约 1 分钟。',
      '加 {sugar} 白糖，盖盖小火煮 2 分钟，盛盘。',
    ],
  },
  {
    id: 'oyster_sauce_greens', zh: '蚝油生菜', name: 'Blanched lettuce with oyster sauce', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: htc('vegetable_dish/蚝油生菜'),
    items: { greens: 300, oyster_sauce: 10, garlic: 15, soy_sauce: 10, salt: 1, sugar: 2, oil: 8 },
    steps: [
      '生菜（或菜心、青菜）洗净，去掉烂叶。',
      '锅里放 1 升凉水、几滴油和一小撮盐烧开，下生菜，每一片都焯 10 秒，捞出控干摆盘。',
      '调汁：{soy_sauce} 生抽、{oyster_sauce} 蚝油、{salt} 盐和 {sugar} 白糖加 15 ml 凉水调匀。',
      '热锅放 {oil} 油，油热放蒜泥，有蒜香飘出时倒入调汁，煮沸立刻关火，均匀浇在生菜上。',
    ],
  },
  {
    id: 'napa_in_broth', zh: '上汤娃娃菜', name: 'Baby napa cabbage in broth', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/上汤娃娃菜/上汤娃娃菜'),
    items: { napa: 500, mushroom: 50, scallion: 3, garlic: 10, ginger: 10, oyster_sauce: 10, sugar: 2, salt: 3, oil: 10 },
    steps: [
      '娃娃菜（或大白菜嫩心）洗净，竖着切开再切段。葱切小段，蒜和姜切片，金针菇洗净撕开。（可选：皮蛋 1 个、午餐肉或火腿肠切 1 cm 丁。）',
      '娃娃菜下开水烫 10 秒捞出。',
      '热锅放 {oil} 油，转小火下葱姜蒜煎炒出香味。',
      '加约 300 ml 清水（没过菜），放娃娃菜、金针菇（和午餐肉），加 {oyster_sauce} 蚝油、{sugar} 糖和 {salt} 盐烧开，煮 3 分钟。',
      '盛出娃娃菜，有皮蛋就放在上面，浇上汤汁。',
    ],
  },
  {
    id: 'smashed_cucumber_garlic', zh: '凉拌黄瓜', name: 'Smashed cucumber salad', kind: 'veg', cuisine: 'Chinese', minutes: 20, source: htc('vegetable_dish/凉拌黄瓜'),
    items: { cucumber: 400, sugar: 5, vinegar: 15, soy_sauce: 10, garlic: 18, salt: 1, oyster_sauce: 5, sesame_oil: 9 },
    steps: [
      '用菜刀把黄瓜拍扁，再剁成 3 cm 长的块，装进碗里。',
      '加 {sugar} 白糖拌匀腌 15 分钟（用糖腌更好吃，颜色好也不会蔫）。',
      '蒜拍碎切末，依次加 {vinegar} 醋、{soy_sauce} 酱油、{salt} 盐、{oyster_sauce} 蚝油和蒜末拌匀。',
      '淋入 {sesame_oil} 香油拌匀。',
    ],
  },
  {
    id: 'zucchini_tomato_egg', zh: '西葫芦炒鸡蛋', name: 'Zucchini, tomato and egg', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/西葫芦炒鸡蛋/西葫芦炒鸡蛋'),
    items: { zucchini: 500, tomato: 100, eggs: 150, oil: 15, salt: 5 },
    steps: [
      '西红柿洗净切小块，西葫芦切成边长约 4 cm 的菱形片，鸡蛋打散。',
      '热锅放 {oil/2} 油，倒入蛋液炒到凝固，用锅铲分成小块盛出。',
      '再放剩下的油，下西红柿炒软，倒入西葫芦翻匀，加 {salt} 盐，转小火焖 4–5 分钟。',
      '倒回鸡蛋，中火翻炒 15 秒，关火盛盘。',
    ],
  },
  {
    id: 'garlic_celery', zh: '蒜蓉炒芹菜', name: 'Crisp celery with garlic', kind: 'veg', cuisine: 'Chinese', minutes: 5, source: htc('vegetable_dish/蒜蓉炒芹菜/蒜蓉炒芹菜'),
    items: { celery: 300, garlic: 15, oil: 15, salt: 2 },
    steps: [
      '芹菜摘掉大部分叶子，只留少量嫩叶。梗粗的纵向剖开，切成不超过 5 cm 的段，下锅前尽量甩干水分。蒜切末。',
      '炒锅烧热，放 {oil} 猪油（或食用油），油热后先撒 {salt} 盐，下蒜末小火煸 10 秒。',
      '转大火倒入芹菜，快速翻炒 30 秒立刻出锅。看起来半生、颜色翠绿、没有炒软塌，口感最脆。',
    ],
  },
  {
    id: 'spinach_egg', zh: '菠菜炒鸡蛋', name: 'Spinach with scrambled egg', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: htc('vegetable_dish/菠菜炒鸡蛋/菠菜炒鸡蛋'),
    items: { spinach: 350, eggs: 100, oil: 15, salt: 4 },
    steps: [
      '菠菜去根洗净，焯水后沥干；鸡蛋打散。',
      '热锅加 {oil/2} 油，油热后倒入蛋液，中火先煎成蛋饼，再用锅铲切成小块，关火盛出（不要洗锅）。',
      '重新开火倒入剩下的油，油热后放菠菜大火翻炒 15 秒，倒回鸡蛋翻匀。',
      '加 {salt} 盐和 100 ml 饮用水，大火翻炒 10 秒，关火盛盘。',
    ],
  },
  {
    id: 'oyster_mushrooms', zh: '蚝油三鲜菇', name: 'Mixed mushrooms in oyster sauce', kind: 'veg', cuisine: 'Chinese', minutes: 15, source: htc('vegetable_dish/蚝油三鲜菇/蚝油三鲜菇'),
    items: { mushroom: 250, broccoli: 100, bell_pepper: 60, chili: 5, ginger: 3, scallion: 5, salt: 5, cornstarch: 10, soy_sauce: 10, oyster_sauce: 5, cooking_wine: 2, oil: 10 },
    steps: [
      '蟹味菇、白玉菇去根掰散，香菇切 0.5–1 cm 厚的片（任意菌菇都可以）。{cornstarch} 淀粉加 50 ml 水调成水淀粉。',
      '水开后下西兰花煮 3 分钟，捞出摆盘。',
      '换水烧开，加 {salt} 盐，下所有菌菇煮 1 分钟，捞出沥干。',
      '起锅烧 {oil} 油，冒小泡时下姜末、{chili} 小米辣和彩椒煸 30 秒。',
      '倒入菌菇，依次加 {soy_sauce} 生抽和 {oyster_sauce} 蚝油（有鸡精加 3 g）翻匀，倒入水淀粉，中火烧到汁浓。',
      '加 {cooking_wine} 料酒和葱花出锅，摆在西兰花上。',
    ],
  },

  // Soups
  {
    id: 'tomato_egg_drop_soup', zh: '西红柿鸡蛋汤', name: 'Tomato and egg soup', kind: 'soup', cuisine: 'Chinese', minutes: 10, source: htc('soup/西红柿鸡蛋汤'),
    items: { tomato: 200, eggs: 100, scallion: 5, ginger: 5, garlic: 5, oil: 15, salt: 4, sesame_oil: 1 },
    steps: [
      '西红柿洗净切块，葱姜蒜切碎，鸡蛋打散。',
      '热锅放 {oil} 油，看到油冒出一丝烟时下葱姜蒜翻炒 30 秒，下西红柿翻炒 1 分钟。',
      '加水到锅内食材高度的约 1.2 倍，放 {salt} 盐。',
      '开锅后倒入蛋液，用筷子打散成蛋花，加几滴 {sesame_oil} 香油，30 秒后关火出锅。',
    ],
  },
  {
    id: 'nori_egg_soup', zh: '紫菜蛋花汤', name: 'Seaweed and egg soup', kind: 'soup', cuisine: 'Chinese', minutes: 10, source: htc('soup/紫菜蛋花汤'),
    items: { nori: 10, eggs: 100, oil: 5, salt: 2, scallion: 5, sesame_oil: 2 },
    steps: [
      '干紫菜用清水泡 15 分钟，捞起沥干。',
      '锅里加约 1 升清水、{oil} 油和 {salt} 盐，水开后放紫菜。',
      '紫菜煮开 3 分钟后，把打好的蛋液慢慢倒进锅里，30 秒后撒葱花，转小火 20 秒。',
      '关火，滴几滴 {sesame_oil} 香油（加一点虾皮也很好）。',
    ],
  },
  {
    id: 'daikon_soup', zh: '白萝卜丝清汤', name: 'Clear daikon soup', kind: 'soup', cuisine: 'Chinese', minutes: 15, source: htc('soup/白萝卜丝清汤'),
    items: { daikon: 200, salt: 3, white_pepper: 2, sesame_oil: 3 },
    steps: [
      '白萝卜去皮，用擦丝器擦成细丝。',
      '锅里加 800 ml 饮用水和萝卜丝，加 {salt} 盐和 {white_pepper} 白胡椒粉（有味精加 3 g）搅匀。',
      '大火烧开后转中小火，继续煮 5 分钟，到萝卜丝变软、半透明。',
      '关火前加 {sesame_oil} 香油（或猪油）拌匀出锅。',
    ],
  },
  {
    id: 'tomato_beef_egg_soup', zh: '番茄牛肉蛋花汤', name: 'Tomato, beef and egg soup', kind: 'soup', cuisine: 'Chinese', minutes: 25, source: htc('soup/番茄牛肉蛋花汤'),
    items: { beef: 200, tomato: 300, eggs: 100, salt: 4, white_pepper: 1, scallion: 5, ginger: 5, garlic: 5 },
    steps: [
      '牛肉切薄片，加 {salt/2} 盐和 {white_pepper/2} 胡椒粉腌 15–20 分钟。',
      '番茄切小块，葱切葱花，姜切片，蒜剁成泥。',
      '水烧开，下姜片和牛肉片煮到变色，再下番茄煮到变软。',
      '鸡蛋打散，慢慢倒进锅里，用筷子搅出蛋花。',
      '加剩下的盐和胡椒粉调味，撒葱花出锅。',
    ],
  },
  {
    id: 'meatball_soup', zh: '生汆丸子汤', name: 'Poached pork meatball soup', kind: 'soup', cuisine: 'Chinese', minutes: 30, source: htc('soup/生汆丸子汤'),
    items: { pork_mince: 300, eggs: 30, cornstarch: 40, salt: 4, white_pepper: 1, ginger: 5, scallion: 10, sichuan_pepper: 1, glass_noodles: 30, wood_ear: 3, sesame_oil: 2, oil: 5 },
    steps: [
      '葱姜加 {sichuan_pepper} 花椒，用开水泡出葱姜花椒水，放凉。肉最好肥瘦三七开，自己剁成肉末（机器打的太黏糊）。粉丝和木耳泡发。',
      '肉末加 {salt/2} 盐和 {white_pepper/2} 胡椒粉抓匀，分几次加葱姜花椒水（每 500 g 肉约 80 g），边加边顺一个方向搅，让肉吸饱水。',
      '加 1 个蛋清继续顺一个方向搅，再加 {cornstarch} 淀粉搅匀，最后拌入 {oil} 熟油，保持嫩滑。',
      '水烧开后转小火，保持似开非开，用手挤成丸子下锅，全部浮起后小火再煮 1 分钟。',
      '碗底放 {glass_noodles} 粉丝和 {wood_ear} 木耳，加剩下的盐和胡椒粉打底，连汤带丸子冲进碗里，淋几滴 {sesame_oil} 香油，撒葱花。',
    ],
  },
  {
    id: 'luosong_soup', zh: '罗宋汤', name: 'Shanghai-style borscht', kind: 'soup', cuisine: 'Chinese', minutes: 100, source: htc('soup/罗宋汤'),
    items: { beef: 150, tomato: 250, ketchup: 5, potato: 200, onion: 60, carrot: 60, celery: 60, cabbage: 120, olive_oil: 5, oil: 5, salt: 8, black_pepper: 2 },
    steps: [
      '洋葱、胡萝卜、芹菜切 1 cm 小丁，土豆切 2 cm 块，番茄切块，包菜去梗手撕成 2 cm 的片（有红肠切块）。',
      '牛肉撒 3 g 盐和 {black_pepper} 黑胡椒腌 5 分钟。平底锅放 {oil} 植物油，把牛肉煎到表面焦黄（可以带生，千万别糊），取出。',
      '汤锅放 {olive_oil} 橄榄油，下洋葱、胡萝卜和芹菜炒到洋葱透明，加 {ketchup} 番茄膏和番茄。',
      '加牛肉和土豆翻匀，加水没过食材，中火煮 1 小时。',
      '加包菜（和红肠）搅匀，中火再煮半小时，开盖加剩下的盐拌匀出锅。',
    ],
  },

  // Saturday one-pot
  {
    id: 'yangzhou_fried_rice', zh: '扬州炒饭', name: 'Yangzhou fried rice', kind: 'onepot', cuisine: 'Chinese', minutes: 25, source: htc('staple/扬州炒饭/扬州炒饭'),
    items: { rice: 500, eggs: 150, shrimp: 120, peas_corn: 60, carrot: 30, scallion: 10, oil: 35, salt: 8 },
    steps: [
      '胡萝卜（和可选的午餐肉）切 2 mm 小丁；葱白、葱绿分别切小段；鸡蛋打散。用隔夜冷饭。',
      '胡萝卜和 {peas_corn} 青豆玉米煮熟捞出；虾煮熟捞出。',
      '热锅放油，油热后倒入 20–30 ml 油，缓慢倒入蛋液，不要搅拌，凝固后立刻捞出。',
      '午餐肉、青豆玉米、胡萝卜和虾下锅翻炒 1–2 分钟，盛出。用水把锅冲干净。',
      '热锅放 10 ml 油爆香葱白，转小火下米饭，用铲子边压边炒到粒粒分明，再倒入鸡蛋压碎混匀。',
      '转大火倒入所有配料快炒 1–2 分钟，撒 {salt} 盐炒匀，最后撒葱绿翻炒 1 分钟出锅。',
    ],
  },
  {
    id: 'fried_rice_cakes', zh: '炒年糕', name: 'Stir-fried rice cakes with cabbage and egg', kind: 'onepot', cuisine: 'Chinese', minutes: 20, source: htc('staple/炒年糕'),
    items: { rice_cake: 500, cabbage: 150, eggs: 100, scallion: 20, oil: 50, soy_sauce: 15, salt: 3 },
    steps: [
      '年糕下开水煮熟，捞进加了水的碗里防止粘连。',
      '小葱切葱花，葱白和葱叶分开；包菜（或其他青菜）切小段；鸡蛋炒熟盛出（做法同西红柿炒鸡蛋）。',
      '热锅加 30 ml 油，下葱白炸到大部分焦黄出香，把葱油倒出来备用。',
      '重新热锅加 20 ml 油，下包菜和鸡蛋翻炒均匀。',
      '倒掉年糕的水，年糕下锅，加 {soy_sauce} 酱油和 {salt} 盐翻炒均匀。',
      '关火，淋入葱油翻匀，撒葱叶盛盘。',
    ],
  },
  {
    id: 'beef_don', zh: '日式肥牛丼饭', name: 'Japanese beef rice bowl (gyudon)', kind: 'onepot', cuisine: 'Japanese', minutes: 25, source: htc('staple/日式肥牛丼饭/日式肥牛丼饭'),
    items: { beef: 250, onion: 200, rice: 400, scallion: 10, sesame: 5, cooking_wine: 30, soy_sauce: 30, oyster_sauce: 20, sugar: 5, dark_soy: 5, oil: 10 },
    steps: [
      '洋葱剥去外层、去芯，切成月牙条；葱切 0.5 cm 小段。{sesame} 白芝麻干锅晃动焙到略呈金黄。',
      '肥牛（薄切牛肉）焯水 1 分钟捞出。',
      '调料：{cooking_wine} 味淋（或料酒）、{soy_sauce} 酱油、{oyster_sauce} 蚝油、{sugar} 糖和 {dark_soy} 老抽（可选，调色）拌匀。',
      '热 {oil} 油下洋葱快速翻炒到透明，转小火加 250 ml 水（或出汁），再开大火煮 3 分钟。',
      '加入牛肉和调料，不停翻动 10 分钟防止粘锅，关火。',
      '盛在米饭上，多淋些汤汁，撒葱花和芝麻。',
    ],
  },
  {
    id: 'teriyaki_chicken_rice', zh: '照烧鸡腿饭', name: 'Teriyaki chicken rice', kind: 'onepot', cuisine: 'Japanese', minutes: 30, source: htc('staple/照烧鸡腿饭'),
    items: { chicken_thigh: 500, carrot: 100, rice: 400, cooking_wine: 15, soy_sauce: 30, honey: 15, dark_soy: 12, black_pepper: 10, salt: 3, garlic: 10, ginger: 10, oil: 20 },
    steps: [
      '鸡腿去骨：皮朝下，用刀尖沿着骨头划开，推开鸡肉，遇到筋膜就切断，最后握住骨头一端拔出（也可以直接买去骨鸡腿）。',
      '鸡腿加 {black_pepper} 黑胡椒、{salt} 盐和姜片腌 5 分钟。',
      '酱汁：{cooking_wine} 料酒、{soy_sauce} 生抽、{honey} 蜂蜜（或 20 g 白糖 + 5 g 淀粉 + 几滴醋）、{dark_soy} 老抽和 30 ml 清水拌匀。',
      '胡萝卜切片焯水 1–2 分钟捞出（原版还配 50 g 西兰花）。',
      '热锅放 {oil} 油，爆香拍碎的大蒜，鸡腿皮朝下中小火煎到两面金黄，锅太干就补一点油。',
      '倒入酱汁，盖盖小火焖 5–10 分钟，酱汁浓稠起泡即可。切块和胡萝卜一起铺在饭上，淋上酱汁。',
    ],
  },
  // ---------- 像老乡鸡那样做饭 CookLikeHOC (github.com/Gar-b-age/CookLikeHOC) ----------
  // Built from the restaurant recipes in 老乡鸡's sourcing report (菜品溯源报告): amounts are scaled down to one meal for two,
  // and the chain's ready-made sauce packs are replaced with home seasoning. Steps are written for a home kitchen.
  // Mains
  {
    id: 'farmhouse_pork', zh: '农家小炒肉', name: 'Farmhouse pork with green peppers', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true, source: hoc('炒菜/农家小炒肉（鸡蛋干版本）'),
    items: { pork_belly: 60, pork: 190, green_pepper: 240, garlic: 15, soy_sauce: 10, dark_soy: 4, oyster_sauce: 8, sugar: 2, salt: 2, oil: 25 },
    steps: [
      '五花肉和瘦肉分别切薄片；青椒（螺丝椒最好）斜切成段；蒜拍扁。',
      '调味碗：{soy_sauce} 生抽、{dark_soy} 老抽、{oyster_sauce} 蚝油、{sugar} 白糖拌匀（代替老乡鸡的小炒肉调料）。',
      '锅里放 {oil/2} 油，下五花肉中小火煸到出油、边缘微黄，下蒜炒香，再下瘦肉片炒到变色。',
      '倒入调味碗翻炒到肉片均匀上色，盛出。',
      '锅里放剩下的油烧热，下青椒和 {salt} 盐大火炒到表皮起皱、刚断生。',
      '倒回肉片大火翻炒 30 秒出锅（有鸡蛋干或香干可以切片一起炒）。',
    ],
  },
  {
    id: 'hunan_beef', zh: '小炒黄牛肉', name: 'Hunan stir-fried beef with chili and celery', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true, source: hoc('炒菜/小炒黄牛肉'),
    items: { beef: 220, celery: 100, chili: 20, garlic: 25, wood_ear: 5, soy_sauce: 12, oyster_sauce: 10, dark_soy: 3, cornstarch: 5, cooking_wine: 5, oil: 30 },
    steps: [
      '木耳提前用冷水泡发，撕小朵。牛肉逆纹切薄片，加 {soy_sauce/2} 生抽、{cooking_wine} 料酒、{cornstarch} 淀粉、1 勺水抓匀，再加 5 ml 油封住，腌 15 分钟。',
      '香芹切段（也可以用青蒜），小米辣切圈，蒜拍碎。调味碗：剩下的生抽、{oyster_sauce} 蚝油、{dark_soy} 老抽（代替小炒黄牛肉汁）。',
      '锅烧到冒烟，放 {oil} 油（有牛油可以加一小块），下蒜和 {chili} 小米辣大火爆香。',
      '下牛肉大火快速划散，变色就好，不要久炒。',
      '倒入调味碗、木耳和香芹，大火翻炒 1 分钟出锅。',
    ],
  },
  {
    id: 'spicy_chicken_dices', zh: '小炒鸡丁', name: 'Chili stir-fried chicken', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true, source: hoc('炒菜/小炒鸡丁'),
    items: { chicken_thigh: 300, green_pepper: 100, chili: 15, garlic: 15, soy_sauce: 10, oyster_sauce: 5, dark_soy: 3, sichuan_pepper: 1, salt: 2, oil: 20 },
    steps: [
      '去骨鸡腿肉切 2 cm 小丁；青线椒和小米辣切圈；蒜拍碎。',
      '锅烧热放 {oil} 油，下鸡丁大火煸炒到变色、表面微焦。',
      '下蒜炒香，加 {soy_sauce} 生抽、{oyster_sauce} 蚝油、{dark_soy} 老抽和 {salt} 盐炒到鸡丁上色。',
      '下青椒和 {chili} 小米辣大火爆炒 1 分钟。',
      '出锅前淋一点花椒油（或用 {sichuan_pepper} 花椒在 1 勺热油里炸香后浇上），翻匀出锅。',
    ],
  },
  {
    id: 'broccoli_chicken_breast', zh: '西兰花炒鸡胸肉', name: 'Chicken breast with broccoli', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true, source: hoc('炒菜/西兰花炒鸡胸肉'),
    items: { chicken_breast: 250, broccoli: 300, carrot: 50, garlic: 10, soy_sauce: 10, oyster_sauce: 10, cornstarch: 5, cooking_wine: 5, salt: 2, oil: 20 },
    steps: [
      '鸡胸肉斜切薄片，加 {cooking_wine} 料酒、{salt} 盐、{cornstarch} 淀粉和 1 勺水抓匀，腌 10 分钟。西兰花切小朵，胡萝卜切片。',
      '西兰花和胡萝卜下开水焯 1 分钟捞出。调味汁：{soy_sauce} 生抽、{oyster_sauce} 蚝油、2 勺水（代替鸡胸肉调味汁）。',
      '锅烧热放 {oil} 油，油热后下鸡胸肉，先别动，等表面定型再轻轻翻炒到变白。',
      '下蒜末炒香，倒入西兰花、胡萝卜和调味汁，大火翻炒 1 分钟出锅。',
    ],
  },
  {
    id: 'carrot_pork', zh: '胡萝卜炒肉丝', name: 'Shredded pork with carrots', kind: 'main', cuisine: 'Chinese', minutes: 15, cookAhead: true, source: hoc('炒菜/胡萝卜炒肉丝'),
    items: { pork: 200, carrot: 300, duojiao: 8, garlic: 12, scallion: 10, soy_sauce: 5, dark_soy: 2, cornstarch: 3, salt: 3, oil: 25 },
    steps: [
      '猪肉（后腿肉或里脊）切丝，加 {soy_sauce} 生抽和 {cornstarch} 淀粉抓匀。胡萝卜切细丝，蒜切末，葱切段。',
      '锅烧热放 {oil} 油，下肉丝炒散到变色。',
      '下蒜末和 {duojiao} 剁椒炒出香味。',
      '下胡萝卜丝、{salt} 盐和 {dark_soy} 老抽大火炒 2–3 分钟到胡萝卜变软（有鸡精加 2 g）。',
      '撒葱段翻匀出锅。',
    ],
  },
  {
    id: 'edamame_chicken', zh: '毛豆烧鸡', name: 'Braised chicken with edamame', kind: 'main', cuisine: 'Chinese', minutes: 35, cookAhead: true, source: hoc('炒菜/经典毛豆烧鸡'),
    items: { chicken_thigh: 350, edamame: 150, ginger: 12, garlic: 12, duojiao: 10, soy_sauce: 10, dark_soy: 5, oyster_sauce: 10, sugar: 3, scallion: 10, salt: 2, oil: 20 },
    steps: [
      '鸡腿（带骨更香）剁成小块，洗净后用厨房纸吸干。姜切片，蒜拍扁，葱切段。',
      '锅烧热放 {oil} 油，下鸡块中大火煸炒到表皮泛黄、出油。',
      '下姜片、蒜和 {duojiao} 剁椒炒香，加 {soy_sauce} 生抽、{dark_soy} 老抽、{oyster_sauce} 蚝油和 {sugar} 白糖炒到鸡块上色（代替毛豆烧鸡料）。',
      '加开水刚好没过鸡块，烧开后盖盖小火煮 15 分钟。',
      '下 {edamame} 毛豆米再煮 3–5 分钟，加 {salt} 盐，开大火收到汤汁浓稠，撒葱段翻匀出锅。',
    ],
  },
  {
    id: 'chestnut_chicken', zh: '板栗烧鸡', name: 'Braised chicken with chestnuts', kind: 'main', cuisine: 'Chinese', minutes: 45, cookAhead: true, source: hoc('炖菜/板栗烧鸡'),
    items: { chicken_thigh: 350, chestnuts: 150, ginger: 10, garlic: 10, chili: 5, doubanjiang: 10, cooking_wine: 10, soy_sauce: 10, dark_soy: 5, oyster_sauce: 5, sugar: 3, oil: 20 },
    steps: [
      '鸡腿剁小块，洗净沥干。板栗仁下开水煮 5 分钟捞出。姜切片，蒜拍扁，小米辣切段。',
      '锅烧干水分，放 {oil} 油烧热，下鸡块大火翻炒到鸡皮收缩、出油。',
      '下姜、蒜和小米辣炒香，再下 {doubanjiang} 豆瓣酱炒出红油。',
      '沿锅边淋 {cooking_wine} 料酒，加 {soy_sauce} 生抽、{dark_soy} 老抽、{oyster_sauce} 蚝油和 {sugar} 白糖炒到鸡块上色（这几样代替板栗烧鸡酱料）。',
      '加开水没过鸡块，倒入板栗，烧开后盖盖小火炖 20 分钟。',
      '开盖大火收到汤汁浓稠出锅。',
    ],
  },
  {
    id: 'chicken_mushroom_stew', zh: '小鸡炖蘑菇', name: 'Chicken stewed with mushrooms', kind: 'main', cuisine: 'Chinese', minutes: 45, cookAhead: true, source: hoc('炖菜/小鸡炖蘑菇'),
    items: { chicken_thigh: 350, mushroom: 200, ginger: 10, scallion: 10, star_anise: 1, cooking_wine: 10, soy_sauce: 15, dark_soy: 5, oyster_sauce: 5, sugar: 3, salt: 2, oil: 15 },
    steps: [
      '鸡腿剁块，冷水下锅加姜片和 {cooking_wine/2} 料酒焯水，煮开后捞出洗净沥干。蘑菇（原版是滑子菇，香菇、榛蘑都行）洗净切块。',
      '锅里放 {oil} 油烧热，下鸡块煸炒到表面泛黄出油。',
      '下剩下的姜片、葱段和 {star_anise} 八角炒香，淋剩下的料酒，加 {soy_sauce} 生抽、{dark_soy} 老抽、{oyster_sauce} 蚝油和 {sugar} 白糖炒 1 分钟上色。',
      '加约 300 ml 开水，烧开后盖盖小火炖 20 分钟。',
      '下蘑菇再炖 5–10 分钟，加 {salt} 盐，大火收到汤汁浓稠出锅。',
    ],
  },
  {
    id: 'celery_shrimp', zh: '西芹炒虾仁', name: 'Shrimp with celery and carrot', kind: 'main', cuisine: 'Chinese', minutes: 15, source: hoc('炒菜/西芹炒虾仁'),
    items: { shrimp: 220, celery: 250, carrot: 60, garlic: 5, salt: 3, sugar: 2, cornstarch: 3, oil: 12 },
    steps: [
      '虾仁完全解冻后冲洗、吸干。西芹去筋斜切段，胡萝卜切片，蒜切片。',
      '调味汁：{salt} 盐、{sugar} 白糖、{cornstarch} 淀粉和 2 勺水拌匀（有鸡精加 2 g）。',
      '烧一锅开水，下西芹、胡萝卜和虾仁焯 1 分钟到虾变色，捞出沥干。',
      '锅里放 {oil} 油，下蒜片炒香，倒入焯好的材料大火翻炒 30 秒。',
      '倒入调味汁翻炒到汤汁透明、包住食材，出锅。',
    ],
  },
  {
    id: 'garlic_vermicelli_shrimp', zh: '蒜蓉粉丝虾', name: 'Steamed garlic shrimp on glass noodles', kind: 'main', cuisine: 'Chinese', minutes: 25, source: hoc('蒸菜/蒜蓉粉丝虾'),
    items: { shrimp: 250, glass_noodles: 50, garlic: 30, chili: 5, scallion: 15, soy_sauce: 20, sugar: 2, oil: 25 },
    steps: [
      '粉丝用温水泡软，剪成两段铺在盘底。虾（带壳开背最好看，虾仁也行）去虾线，摆在粉丝上。',
      '蒜剁成蒜蓉，分成两半。锅里放 {oil/2} 油，小火把一半蒜蓉炸到金黄，关火倒入另一半生蒜蓉拌匀，就是金银蒜蓉酱。',
      '把蒜蓉酱铺在虾上，撒切碎的 {chili} 小米辣（或红椒丁）。',
      '水开后上锅大火蒸 6–8 分钟，虾完全变色即可。',
      '调味汁：{soy_sauce} 生抽、{sugar} 白糖和 1 勺水，淋在虾和粉丝上。撒葱花，再浇上剩下的烧到冒烟的热油。',
    ],
  },
  {
    id: 'shrimp_steamed_egg', zh: '虾仁蒸鸡蛋', name: 'Silky steamed eggs with shrimp', kind: 'main', cuisine: 'Chinese', minutes: 20, source: hoc('蒸菜/虾仁蒸鸡蛋'),
    items: { eggs: 200, shrimp: 100, scallion: 5, salt: 2, soy_sauce: 8, sesame_oil: 3 },
    steps: [
      '鸡蛋打散，加 {salt} 盐和 1.5 倍蛋液量的温水（约 300 ml）顺一个方向搅匀，过筛撇掉泡沫，倒进浅盘或碗。',
      '虾仁解冻吸干，用一点盐和淀粉抓一下。',
      '盖上盘子或保鲜膜（扎几个小孔），水开后中小火蒸 8 分钟，到蛋液表面刚凝固。',
      '把虾仁摆在蛋面上，再蒸 3–4 分钟，关火焖 1 分钟。',
      '淋 {soy_sauce} 生抽（蒸鱼豉油更好）和 {sesame_oil} 香油，撒葱花。',
    ],
  },
  {
    id: 'scallion_oil_chicken', zh: '葱油鸡', name: 'Steamed chicken with scallion oil', kind: 'main', cuisine: 'Chinese', minutes: 45, source: hoc('蒸菜/葱油鸡（鸡排腿版）'),
    items: { chicken_thigh: 450, scallion: 40, ginger: 10, salt: 5, soy_sauce: 30, sugar: 3, oil: 20 },
    steps: [
      '带骨鸡腿洗净吸干，用 {salt} 盐、几段葱和姜片抹匀，腌 20 分钟。',
      '水开后上锅大火蒸 25–30 分钟，筷子扎最厚处没有血水即可。蒸好后稍放凉，剁成 2 cm 宽的块，码盘。',
      '做葱油：剩下的葱切葱花，留一小把，其余放碗里；{oil} 油烧到冒烟，浇在葱花上。',
      '调味汁：{soy_sauce} 生抽（原版用味极鲜）、{sugar} 白糖、1 勺温水和一半葱油拌匀。',
      '鸡块回锅蒸 3 分钟热透，淋上调味汁和剩下的葱油，撒葱花。',
    ],
  },
  {
    id: 'rice_powder_pork', zh: '粉蒸肉', name: 'Rice-powder steamed pork', kind: 'main', cuisine: 'Chinese', minutes: 70, cookAhead: true, source: hoc('蒸菜/粉蒸肉'),
    items: { pork_belly: 250, rice_powder: 80, potato: 200, doubanjiang: 8, soy_sauce: 8, dark_soy: 3, cooking_wine: 5, sugar: 3, ginger: 5, scallion: 5, oil: 10 },
    steps: [
      '五花肉（或前夹肉）切 0.5 cm 厚的片，加 {doubanjiang} 豆瓣酱、{soy_sauce} 生抽、{dark_soy} 老抽、{cooking_wine} 料酒、{sugar} 白糖和姜末抓匀，腌 20 分钟（代替蒸肉酱）。',
      '{rice_powder} 蒸肉米粉加约 50 ml 水拌到湿润，倒进肉里，让每片肉都均匀裹上米粉，最后拌入 {oil} 油。',
      '土豆去皮切滚刀块铺在碗底（原版用黄心红薯，有就换成红薯）。',
      '把米粉肉一片片铺在土豆上，剩下的米粉也撒上。',
      '水开后上锅大火转中火蒸 50–60 分钟，到肉软糯、土豆一夹就烂。撒葱花出锅。',
    ],
  },
  {
    id: 'meicai_pork', zh: '梅菜扣肉', name: 'Pork belly steamed with preserved mustard greens', kind: 'main', cuisine: 'Chinese', minutes: 150, cookAhead: true, source: hoc('蒸菜/梅菜扣肉'),
    items: { pork_belly: 400, meigancai: 40, dark_soy: 15, soy_sauce: 10, oyster_sauce: 15, sugar: 10, cooking_wine: 10, ginger: 10, scallion: 10, star_anise: 1, oil: 20 },
    steps: [
      '{meigancai} 梅干菜用温水泡 30 分钟，反复搓洗几遍去沙，挤干切碎。',
      '整块带皮五花肉冷水下锅，加姜片、葱段和 {cooking_wine} 料酒，煮 20 分钟到筷子能扎透，捞出擦干，趁热在肉皮上抹一层 {dark_soy/2} 老抽。',
      '锅里放 {oil} 油，肉皮朝下中火煎到起泡、呈虎皮状（盖锅盖防溅油），捞出泡冷水 10 分钟让肉皮起皱。',
      '肉切 0.5 cm 厚的大片，加剩下的老抽、{soy_sauce} 生抽、{oyster_sauce} 蚝油和 {sugar/2} 白糖抓匀，皮朝下整齐码进碗里。',
      '锅里放少许油，下梅干菜、{star_anise} 八角和剩下的白糖炒干炒香，倒入码肉剩下的酱汁拌匀，压在肉上。',
      '水开后上锅中火蒸 90 分钟（原版 60 分钟，但他们的扣肉已经卤过）。扣肉碗上盖一个盘子，倒扣出来上桌。',
    ],
  },
  {
    id: 'napa_tofu_stew', zh: '白菜炖豆腐', name: 'Napa cabbage braised with tofu', kind: 'main', cuisine: 'Chinese', minutes: 25, cookAhead: true, source: hoc('炖菜/白菜炖豆腐'),
    items: { tofu: 400, napa: 300, garlic: 10, ginger: 5, scallion: 5, soy_sauce: 12, oyster_sauce: 8, white_pepper: 1, salt: 2, oil: 15 },
    steps: [
      '豆腐切 2 cm 方块，白菜切段，帮和叶分开。蒜拍扁，姜切片。',
      '锅里放 {oil} 油（加一小勺猪油更香），下蒜和姜片炒香，再下白菜帮炒软。',
      '加约 300 ml 水、{soy_sauce} 生抽、{oyster_sauce} 蚝油和 {salt} 盐（代替炒菜基料），轻轻放入豆腐，烧开后小火炖 8 分钟。',
      '下白菜叶，烧开后小火再炖 3–5 分钟到入味。',
      '撒 {white_pepper} 白胡椒粉和葱花出锅。',
    ],
  },
  {
    id: 'three_delicacy_tofu', zh: '砂锅三鲜豆腐', name: 'Clay-pot tofu with shrimp and mushrooms', kind: 'main', cuisine: 'Chinese', minutes: 25, source: hoc('砂锅菜/砂锅三鲜豆腐'),
    items: { tofu: 350, shrimp: 100, mushroom: 100, wood_ear: 4, ginger: 5, scallion: 5, oyster_sauce: 5, salt: 3, white_pepper: 1, sesame_oil: 2, oil: 10 },
    steps: [
      '木耳提前泡发撕小朵；豆腐切块；蘑菇（原版是白玉菇）切小块；虾焯水到变色捞出。',
      '锅里放 {oil} 油，下姜片爆香，加约 400 ml 开水、{oyster_sauce} 蚝油和 {salt} 盐（代替三鲜豆腐汤料）。',
      '烧开后下豆腐，小火煮 5 分钟，再下木耳和蘑菇煮 3 分钟。',
      '倒进砂锅（没有就用原锅），把虾摆在豆腐上，烧开后煮 1 分钟。',
      '撒 {white_pepper} 白胡椒粉、葱花，淋几滴 {sesame_oil} 香油。',
    ],
  },

  // Vegetable dishes
  {
    id: 'cabbage_egg', zh: '包菜炒鸡蛋', name: 'Cabbage stir-fried with egg', kind: 'veg', cuisine: 'Chinese', minutes: 12, source: hoc('炒菜/包菜炒鸡蛋'),
    items: { cabbage: 300, carrot: 50, eggs: 100, garlic: 12, soy_sauce: 12, salt: 3, oil: 25 },
    steps: [
      '包菜切丝，胡萝卜切丝，蒜拍碎，鸡蛋打散。',
      '锅里放 {oil/2} 油，倒入蛋液炒成大块蛋片，盛出。',
      '放剩下的油（加一勺猪油更香），下蒜炒香。',
      '下包菜和胡萝卜丝，加 {salt} 盐和 {soy_sauce} 生抽大火翻炒 2 分钟（有鸡精加 2 g）。',
      '倒回蛋片翻炒 1 分钟出锅。',
    ],
  },
  {
    id: 'green_pepper_egg', zh: '青椒炒鸡蛋', name: 'Green peppers with scrambled egg', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: hoc('炒菜/青椒炒鸡蛋'),
    items: { green_pepper: 250, eggs: 100, garlic: 10, salt: 3, oil: 25 },
    steps: [
      '青椒去籽切块或切丝，蒜切片，鸡蛋打散加一小撮盐。',
      '锅里放 {oil/2} 油，倒入蛋液炒成蛋片，盛出。',
      '放剩下的油，下青椒、蒜片和 {salt} 盐大火爆炒到青椒断生、表皮微皱。',
      '倒回蛋片翻炒均匀出锅。',
    ],
  },
  {
    id: 'hot_sour_cabbage', zh: '酸辣包菜', name: 'Hot and sour shredded cabbage', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: hoc('炒菜/酸辣包菜'),
    items: { cabbage: 400, duojiao: 10, garlic: 12, vinegar: 8, sugar: 2, salt: 4, oil: 20 },
    steps: [
      '包菜切丝或手撕成片，洗净沥干；蒜拍碎。',
      '锅里放 {oil} 油，下蒜和 {duojiao} 剁椒炒香。',
      '下包菜、{salt} 盐和 {sugar} 白糖，大火翻炒 3 分钟到包菜变软。',
      '沿锅边淋 {vinegar} 陈醋，翻匀出锅。',
    ],
  },
  {
    id: 'hot_sour_napa', zh: '酸辣大白菜', name: 'Hot and sour napa cabbage', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: hoc('炒菜/酸辣大白菜'),
    items: { napa: 450, duojiao: 8, garlic: 12, soy_sauce: 10, vinegar: 5, salt: 3, oil: 20 },
    steps: [
      '大白菜斜刀片成片，帮和叶分开；蒜拍碎。',
      '锅里放 {oil} 油（加一勺猪油更香），下蒜和 {duojiao} 剁椒炒香。',
      '先下白菜帮大火炒 1 分钟，再下白菜叶，加 {soy_sauce} 生抽和 {salt} 盐炒 2–3 分钟。',
      '沿锅边淋 {vinegar} 陈醋，翻匀出锅。',
    ],
  },
  {
    id: 'garlic_mash_spinach', zh: '蒜泥菠菜', name: 'Spinach with mashed garlic', kind: 'veg', cuisine: 'Chinese', minutes: 8, source: hoc('炒菜/蒜泥菠菜'),
    items: { spinach: 350, garlic: 15, salt: 3, oil: 15 },
    steps: [
      '菠菜洗净切段，蒜捣成蒜泥。',
      '烧一锅开水，下菠菜烫 30 秒捞出，沥干水分（菠菜焯过不涩）。',
      '锅里放 {oil} 油，下蒜泥小火炒香。',
      '倒入菠菜和 {salt} 盐，大火快速翻匀出锅。',
    ],
  },
  {
    id: 'mushroom_bok_choy', zh: '香菇青菜', name: 'Bok choy with shiitake', kind: 'veg', cuisine: 'Chinese', minutes: 8, source: hoc('炒菜/香菇青菜'),
    items: { bok_choy: 300, mushroom: 60, salt: 3, sugar: 1, oil: 15 },
    steps: [
      '青菜洗净，大的对半切开；香菇切片。',
      '锅烧热放 {oil} 油（加一勺猪油更香），下香菇片炒软。',
      '下青菜、{salt} 盐和 {sugar} 白糖，大火爆炒 2 分钟到青菜断生出锅。',
    ],
  },
  {
    id: 'scallion_oil_greens', zh: '葱油菜心', name: 'Blanched greens with scallion soy dressing', kind: 'veg', cuisine: 'Chinese', minutes: 8, source: hoc('烫菜/葱油菜心'),
    items: { greens: 300, scallion: 15, soy_sauce: 20, sugar: 3, oil: 15 },
    steps: [
      '菜心（青菜、生菜都行）洗净。葱切丝。',
      '豉油汁：{soy_sauce} 生抽、{sugar} 白糖和 1 勺水拌匀。',
      '烧一锅开水，加几滴油和一小撮盐，下菜心烫 1 分钟（生菜 10 秒），捞出沥干码盘。',
      '把豉油汁淋在菜上，铺上葱丝；{oil} 油烧到冒烟，浇在葱丝上。',
    ],
  },
  {
    id: 'carrot_wood_ear', zh: '胡萝卜炒木耳', name: 'Carrots with wood ear mushrooms', kind: 'veg', cuisine: 'Chinese', minutes: 12, source: hoc('炒菜/胡萝卜炒木耳'),
    items: { carrot: 250, wood_ear: 5, garlic: 15, soy_sauce: 10, salt: 1, oil: 15 },
    steps: [
      '木耳提前用冷水泡发，撕小朵；胡萝卜切片；蒜切末（原版用青蒜，有的话切段）。',
      '锅里放 {oil} 油烧热，下胡萝卜片和木耳，加 {soy_sauce} 生抽和 {salt} 盐大火爆炒 2–3 分钟到胡萝卜熟透。',
      '下蒜末翻炒均匀出锅。',
    ],
  },
  {
    id: 'celery_dried_tofu', zh: '芹菜炒香干', name: 'Celery with pressed tofu', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: hoc('炒菜/芹菜炒香干'),
    items: { celery: 250, dried_tofu: 150, bell_pepper: 30, salt: 3, oil: 20 },
    steps: [
      '芹菜去叶切 3 cm 段，香干切条，红椒切丝。',
      '锅里放 {oil} 油烧热，下芹菜、香干、红椒和 {salt} 盐（有鸡精加 2 g）。',
      '大火爆炒 3 分钟出锅。',
    ],
  },
  {
    id: 'celery_peanuts', zh: '西芹花生米', name: 'Celery and peanut salad', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: hoc('凉拌/西芹花生米'),
    items: { celery: 250, peanuts: 80, bell_pepper: 30, salt: 2, sesame_oil: 8 },
    steps: [
      '西芹去筋切小段或小丁，红椒切丁。用生花生的话先加盐煮 10 分钟。',
      '烧一锅开水，下西芹和红椒烫 1 分钟，捞出用凉开水冲凉，沥干。',
      '加花生米、{salt} 盐和 {sesame_oil} 香油（有鸡精加 2 g），拌匀即可。',
    ],
  },
  {
    id: 'edamame_pepper', zh: '青椒毛豆米', name: 'Edamame with green pepper', kind: 'veg', cuisine: 'Chinese', minutes: 10, source: hoc('炒菜/青椒毛豆米'),
    items: { edamame: 250, green_pepper: 80, garlic: 10, salt: 3, sugar: 2, oil: 20 },
    steps: [
      '青椒切丝，蒜拍碎。毛豆米不用解冻，冲一下水。',
      '锅里放 {oil} 油烧热，下蒜炒香。',
      '下毛豆米翻炒 1 分钟，加 {salt} 盐和 {sugar} 白糖，加 2 勺水再炒 2 分钟到毛豆熟透。',
      '下青椒丝炒 30 秒出锅。',
    ],
  },

  // Soups
  {
    id: 'mushroom_chicken_soup', zh: '菌菇鸡汤', name: 'Chicken and mushroom soup', kind: 'soup', cuisine: 'Chinese', minutes: 90, source: hoc('汤/菌菇鸡汤'),
    items: { chicken_thigh: 250, mushroom: 120, ginger: 8, cooking_wine: 8, rock_sugar: 3, salt: 4 },
    steps: [
      '鸡块（老母鸡最好，鸡腿也行）冷水下锅，水开后立刻关火，捞出用冷水冲净。',
      '菌菇（原版是鹿茸菇、虫草花、姬松茸，香菇、蟹味菇都行）洗净。',
      '砂锅里放鸡块、姜片、{cooking_wine} 料酒（花雕更好）、{rock_sugar} 冰糖和约 1 L 水，大火烧开撇去浮沫。',
      '转小火炖 60 分钟，下菌菇再炖 20 分钟。',
      '加 {salt} 盐调味，撇掉浮油出锅。',
    ],
  },

  // Saturday one-pot
  {
    id: 'shiitake_chicken_noodles', zh: '香菇鸡汤面', name: 'Chicken soup noodles with shiitake', kind: 'onepot', cuisine: 'Chinese', minutes: 75, source: hoc('主食/香菇鸡汤面'),
    items: { chicken_thigh: 300, dried_shiitake: 8, noodles: 220, napa: 150, eggs: 100, ginger: 8, scallion: 8, salt: 5, oil: 5 },
    steps: [
      '干香菇用温水泡发（泡香菇的水留着）。鸡腿剁块，用一小撮盐抹匀腌 20 分钟，焯水后洗净。',
      '鸡块、姜片、香菇和泡香菇的水一起放进锅里，加水到约 1.5 L，烧开撇沫，小火炖 60 分钟，加 {salt} 盐调味。',
      '鸡蛋打散，平底锅抹 {oil} 油摊成薄蛋皮，切丝。',
      '另烧一锅水煮 {noodles} 面条约 4 分钟，最后 30 秒下白菜叶（原版是青菜）一起烫熟，捞进碗里。',
      '浇上鸡汤，摆上鸡块、香菇、白菜和蛋皮丝，撒葱花。',
    ],
  },
  {
    id: 'spicy_beef_noodles', zh: '香辣牛肉面', name: 'Spicy braised beef noodle soup', kind: 'onepot', cuisine: 'Chinese', minutes: 120, source: hoc('主食/香辣牛肉面'),
    items: { beef: 300, noodles: 250, napa: 150, ginger: 10, scallion: 10, garlic: 10, doubanjiang: 15, dried_chili: 4, sichuan_pepper: 2, star_anise: 2, spices: 2, cooking_wine: 15, soy_sauce: 15, dark_soy: 8, rock_sugar: 8, salt: 3, oil: 20 },
    steps: [
      '牛肉（牛腩或牛腱）切 3 cm 块，冷水下锅加 {cooking_wine/2} 料酒焯水，煮开后捞出洗净。',
      '锅里放 {oil} 油，下姜片、蒜、葱段、{star_anise} 八角、{spices} 桂皮香叶、{sichuan_pepper} 花椒和 {dried_chili} 干辣椒小火炒香，再下 {doubanjiang} 豆瓣酱炒出红油。',
      '下牛肉翻炒，淋剩下的料酒，加 {soy_sauce} 生抽、{dark_soy} 老抽和 {rock_sugar} 冰糖炒到上色。',
      '加开水没过牛肉 3 cm 以上，烧开后小火炖 90 分钟到牛肉软烂，加 {salt} 盐调味（汤要多留一些做面汤）。',
      '另烧一锅水煮 {noodles} 面条 3–4 分钟，最后 1 分钟下白菜（原版是青菜）烫熟，捞进碗里。',
      '浇上牛肉和汤，撒葱花（有青蒜、香菜更好）。',
    ],
  },
]

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]))
