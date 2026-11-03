export type DishKind = 'main' | 'veg' | 'soup' | 'onepot'

export interface Recipe {
  id: string
  name: string
  kind: DishKind
  cuisine: string
  minutes: number
  /** Main that reheats and freezes well, so it can be cooked on Sunday for a weekday dinner. */
  cookAhead?: boolean
  /** Grams for one meal for two people. The planner scales this to the batch size and the nutrition targets. */
  items: Record<string, number>
  steps: string[]
}

export const RECIPES: Recipe[] = [
  // ---------- Mains ----------
  {
    id: 'tomato_egg', name: 'Tomato & egg stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 15,
    items: { eggs: 200, tomato: 300, scallion: 10 },
    steps: ['Beat the eggs with a pinch of salt. Cut the tomatoes into wedges.', 'Scramble the eggs in hot oil until just set, then remove them.', 'Stir-fry the tomatoes until soft and juicy. Add 1 tsp sugar and a pinch of salt.', 'Return the eggs, toss, and finish with scallions.'],
  },
  {
    id: 'kung_pao_chicken', name: 'Kung pao chicken', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true,
    items: { chicken_thigh: 250, bell_pepper: 100, cucumber: 100, peanuts: 30, garlic: 10, ginger: 5, scallion: 10, soy_sauce: 15, vinegar: 10, cornstarch: 5 },
    steps: ['Cube the chicken and marinate it with soy sauce and cornstarch.', 'Mix the sauce: 1 tbsp soy sauce, 1 tbsp vinegar, 1 tsp sugar, ½ tsp cornstarch, 2 tbsp water.', 'Sear the chicken until golden. Add garlic, ginger, the diced pepper and cucumber.', 'Pour in the sauce, toss until glossy, then add peanuts and scallions.'],
  },
  {
    id: 'red_braised_pork', name: 'Red-braised pork with eggs', kind: 'main', cuisine: 'Chinese', minutes: 70, cookAhead: true,
    items: { pork: 250, eggs: 100, ginger: 10, scallion: 10, soy_sauce: 30 },
    steps: ['Hard-boil and peel the eggs. Cube the pork and blanch it for 2 minutes.', 'Caramelise 1 tbsp sugar in oil, add the pork, and toss until coated.', 'Add ginger, scallions, soy sauce and hot water to cover. Simmer covered for 50 minutes.', 'Add the eggs, then reduce uncovered until the sauce is sticky.'],
  },
  {
    id: 'beef_broccoli', name: 'Beef & broccoli', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true,
    items: { beef: 220, broccoli: 250, garlic: 10, oyster_sauce: 20, soy_sauce: 10, cornstarch: 5 },
    steps: ['Slice the beef thin and marinate it with soy sauce and cornstarch.', 'Blanch the broccoli for 1 minute, then drain.', 'Sear the beef on high heat until just browned, then remove it.', 'Fry the garlic, add the broccoli, beef and oyster sauce, and toss for 1 minute.'],
  },
  {
    id: 'steamed_fish', name: 'Steamed fish with ginger & scallion', kind: 'main', cuisine: 'Chinese', minutes: 15,
    items: { fish: 300, ginger: 15, scallion: 20, soy_sauce: 20 },
    steps: ['Lay the fish on a plate on top of ginger slices.', 'Steam for 8–10 minutes until the fish flakes.', 'Pour off the liquid, top with shredded scallion and ginger, and drizzle with soy sauce.', 'Pour 2 tbsp smoking-hot oil over the top.'],
  },
  {
    id: 'mapo_tofu', name: 'Mapo tofu', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true,
    items: { tofu: 400, pork_mince: 100, garlic: 10, scallion: 10, doubanjiang: 20, cornstarch: 5 },
    steps: ['Cube the tofu and simmer it in salted water for 2 minutes, then drain.', 'Fry the pork until crisp, then add the doubanjiang and garlic until the oil turns red.', 'Add ½ cup water and the tofu, and simmer for 5 minutes.', 'Thicken with cornstarch slurry and top with scallions.'],
  },
  {
    id: 'shrimp_eggs', name: 'Shrimp scrambled eggs', kind: 'main', cuisine: 'Chinese', minutes: 10,
    items: { shrimp: 200, eggs: 150, scallion: 10, cornstarch: 3 },
    steps: ['Pat the shrimp dry and toss with salt and cornstarch.', 'Sear the shrimp until pink, then remove them.', 'Beat the eggs with scallions and pour into the pan.', 'Fold the shrimp back in when the eggs are half set, and take off the heat while they are still soft.'],
  },
  {
    id: 'garlic_shrimp_broccoli', name: 'Garlic shrimp & broccoli', kind: 'main', cuisine: 'Chinese', minutes: 15,
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
    id: 'pepper_pork', name: 'Pork with bell peppers', kind: 'main', cuisine: 'Chinese', minutes: 15, cookAhead: true,
    items: { pork: 220, bell_pepper: 200, garlic: 10, soy_sauce: 15, cornstarch: 5 },
    steps: ['Slice the pork thin and marinate it with soy sauce and cornstarch.', 'Stir-fry the pork until it changes colour, then remove it.', 'Fry the garlic and the sliced peppers for 2 minutes.', 'Return the pork, add a splash of soy sauce, and toss.'],
  },
  {
    id: 'chicken_mushroom', name: 'Chicken, mushroom & pepper stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true,
    items: { chicken_breast: 250, mushroom: 200, bell_pepper: 100, garlic: 10, oyster_sauce: 15, cornstarch: 5 },
    steps: ['Slice the chicken and coat it with cornstarch and a pinch of salt.', 'Sear the chicken until golden, then remove it.', 'Fry the mushrooms until browned, then add the garlic and peppers.', 'Return the chicken, add the oyster sauce, and toss.'],
  },
  {
    id: 'beef_tomato', name: 'Tomato beef with onion', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true,
    items: { beef: 220, tomato: 250, onion: 100, soy_sauce: 15, cornstarch: 5 },
    steps: ['Slice the beef and marinate it with soy sauce and cornstarch.', 'Sear the beef quickly, then remove it.', 'Soften the onion, then add the tomato wedges and 1 tsp sugar, and cook into a sauce.', 'Return the beef and toss for 30 seconds.'],
  },
  {
    id: 'cabbage_pork', name: 'Hand-torn cabbage with pork', kind: 'main', cuisine: 'Chinese', minutes: 15, cookAhead: true,
    items: { pork: 150, cabbage: 300, garlic: 10, vinegar: 10, soy_sauce: 15 },
    steps: ['Tear the cabbage into pieces and slice the pork thin.', 'Render the pork until lightly crisp.', 'Add the garlic and cabbage, and stir-fry on high heat for 3 minutes.', 'Splash in vinegar and soy sauce around the edge of the wok, and toss.'],
  },
  {
    id: 'eggplant_pork', name: 'Fish-fragrant eggplant with pork', kind: 'main', cuisine: 'Chinese', minutes: 25, cookAhead: true,
    items: { pork_mince: 150, eggplant: 350, garlic: 10, ginger: 5, scallion: 10, doubanjiang: 15, vinegar: 10 },
    steps: ['Cut the eggplant into batons and pan-fry until soft, then remove it.', 'Fry the pork until crisp, then add the doubanjiang, garlic and ginger.', 'Add the eggplant with 1 tbsp vinegar, 1 tsp sugar and ¼ cup water.', 'Simmer for 3 minutes and top with scallions.'],
  },
  {
    id: 'chicken_curry', name: 'Japanese chicken curry', kind: 'main', cuisine: 'Western', minutes: 35, cookAhead: true,
    items: { chicken_thigh: 250, potato: 200, carrot: 150, onion: 150, curry_roux: 50 },
    steps: ['Brown the chicken pieces with the sliced onion.', 'Add the carrot and potato chunks with 2 cups water. Simmer for 15 minutes.', 'Turn off the heat and melt in the curry roux.', 'Simmer for 5 more minutes until thick. Serve with rice.'],
  },
  {
    id: 'fish_tofu', name: 'Braised fish with tofu', kind: 'main', cuisine: 'Chinese', minutes: 25,
    items: { fish: 250, tofu: 200, ginger: 10, scallion: 10, soy_sauce: 20 },
    steps: ['Cut the fish into chunks and pan-fry until golden on both sides.', 'Add ginger, sliced tofu, soy sauce, 1 tsp sugar and ½ cup water.', 'Simmer gently for 8 minutes, spooning the sauce over.', 'Finish with scallions.'],
  },
  {
    id: 'lemon_fish_zucchini', name: 'Pan-fried lemon fish with zucchini', kind: 'main', cuisine: 'Western', minutes: 15,
    items: { fish: 300, zucchini: 250, garlic: 10, olive_oil: 15, lemon: 30 },
    steps: ['Season the fish with salt and pepper and pat it dry.', 'Pan-fry for 3 minutes per side, then remove it.', 'Sauté the sliced zucchini with garlic until golden.', 'Serve the fish on the zucchini and squeeze over the lemon.'],
  },
  {
    id: 'chicken_broccoli_carrot', name: 'Chicken, broccoli & carrot stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true,
    items: { chicken_breast: 250, broccoli: 200, carrot: 100, garlic: 10, soy_sauce: 15, cornstarch: 5 },
    steps: ['Slice the chicken and marinate it with soy sauce and cornstarch.', 'Blanch the broccoli and sliced carrot for 1 minute.', 'Sear the chicken, then add the garlic and vegetables.', 'Toss with a splash of soy sauce and water until glossy.'],
  },
  {
    id: 'pork_green_beans', name: 'Dry-fried green beans with pork', kind: 'main', cuisine: 'Chinese', minutes: 20, cookAhead: true,
    items: { pork_mince: 150, green_beans: 300, garlic: 10, soy_sauce: 15 },
    steps: ['Pan-fry the green beans in oil until blistered, then remove them.', 'Fry the pork until crisp and browned.', 'Add the garlic, the beans and soy sauce.', 'Toss on high heat for 1 minute.'],
  },
  {
    id: 'beef_celery', name: 'Beef & celery stir-fry', kind: 'main', cuisine: 'Chinese', minutes: 15, cookAhead: true,
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
    id: 'garlic_bok_choy', name: 'Garlic bok choy', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { bok_choy: 400, garlic: 10, oyster_sauce: 10 },
    steps: ['Halve the bok choy and wash out any grit.', 'Fry the garlic, add the bok choy, and stir-fry on high heat for 2 minutes.', 'Season with oyster sauce and a splash of water.'],
  },
  {
    id: 'garlic_spinach', name: 'Garlic spinach', kind: 'veg', cuisine: 'Chinese', minutes: 5,
    items: { spinach: 350, garlic: 10 },
    steps: ['Wash and drain the spinach.', 'Fry the garlic, add the spinach, and toss until just wilted.', 'Season with salt.'],
  },
  {
    id: 'cabbage_stir_fry', name: 'Sour cabbage stir-fry', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { cabbage: 400, garlic: 10, vinegar: 15 },
    steps: ['Tear the cabbage into pieces.', 'Stir-fry with garlic on high heat for 3 minutes.', 'Add vinegar, salt and a pinch of sugar.'],
  },
  {
    id: 'smashed_cucumber', name: 'Smashed cucumber salad', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { cucumber: 350, garlic: 10, vinegar: 15, soy_sauce: 10 },
    steps: ['Smash the cucumbers with a knife and cut them into chunks. Salt for 10 minutes, then drain.', 'Toss with minced garlic, vinegar, soy sauce, sesame oil and chili oil.'],
  },
  {
    id: 'garlic_broccoli', name: 'Garlic broccoli', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { broccoli: 350, garlic: 10 },
    steps: ['Blanch the florets for 1 minute.', 'Stir-fry with garlic for 1 minute, and season with salt.'],
  },
  {
    id: 'tomato_cucumber_salad', name: 'Tomato & cucumber salad', kind: 'veg', cuisine: 'Western', minutes: 10,
    items: { tomato: 200, cucumber: 200, olive_oil: 15, lemon: 15 },
    steps: ['Chop the tomatoes and cucumber.', 'Dress with olive oil, lemon, salt and pepper.'],
  },
  {
    id: 'potato_shreds', name: 'Hot & sour potato shreds with pepper', kind: 'veg', cuisine: 'Chinese', minutes: 15,
    items: { potato: 300, bell_pepper: 100, garlic: 5, vinegar: 15 },
    steps: ['Cut the potatoes into matchsticks and rinse off the starch.', 'Stir-fry with garlic and sliced pepper on high heat for 3 minutes.', 'Add vinegar and salt. They should stay crunchy.'],
  },
  {
    id: 'bok_choy_mushroom', name: 'Bok choy with mushrooms', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { bok_choy: 300, mushroom: 150, garlic: 5, oyster_sauce: 15 },
    steps: ['Blanch the bok choy and arrange it on a plate.', 'Fry the sliced mushrooms with garlic until browned.', 'Add oyster sauce and a splash of water, and pour over the bok choy.'],
  },
  {
    id: 'napa_vinegar', name: 'Vinegar-glazed napa cabbage', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { napa: 400, garlic: 10, vinegar: 15, soy_sauce: 10 },
    steps: ['Slice the napa, keeping the stems and leaves separate.', 'Stir-fry the stems with garlic for 2 minutes, then add the leaves.', 'Finish with vinegar, soy sauce and a pinch of sugar.'],
  },
  {
    id: 'garlic_green_beans', name: 'Garlic green beans', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { green_beans: 350, garlic: 10 },
    steps: ['Blanch the beans for 2 minutes.', 'Stir-fry with garlic and salt for 2 minutes.'],
  },
  {
    id: 'braised_eggplant', name: 'Garlic braised eggplant', kind: 'veg', cuisine: 'Chinese', minutes: 20,
    items: { eggplant: 400, garlic: 15, scallion: 10, soy_sauce: 15 },
    steps: ['Cut the eggplant into batons and pan-fry until soft.', 'Add the garlic, soy sauce, 1 tsp sugar and a splash of water.', 'Simmer for 2 minutes and top with scallions.'],
  },
  {
    id: 'zucchini_eggs', name: 'Zucchini with eggs', kind: 'veg', cuisine: 'Chinese', minutes: 10,
    items: { zucchini: 300, eggs: 100, garlic: 5 },
    steps: ['Scramble the eggs and set them aside.', 'Stir-fry the sliced zucchini with garlic until tender.', 'Return the eggs and season with salt.'],
  },
  {
    id: 'cabbage_carrot_slaw', name: 'Cabbage & carrot slaw', kind: 'veg', cuisine: 'Western', minutes: 10,
    items: { cabbage: 250, carrot: 150, olive_oil: 15, lemon: 15, vinegar: 10 },
    steps: ['Finely shred the cabbage and grate the carrots.', 'Toss with olive oil, lemon, vinegar, salt and a pinch of sugar. It keeps for 3 days.'],
  },
  {
    id: 'celery_carrot_tofu', name: 'Celery, carrot & tofu stir-fry', kind: 'veg', cuisine: 'Chinese', minutes: 15,
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
    id: 'tomato_egg_soup', name: 'Tomato egg-drop soup', kind: 'soup', cuisine: 'Chinese', minutes: 15,
    items: { tomato: 200, eggs: 100, scallion: 10, cornstarch: 5 },
    steps: ['Fry the tomato wedges until soft, then add 3 cups water and boil.', 'Thicken lightly with cornstarch slurry.', 'Drizzle in the beaten eggs while stirring slowly. Season and top with scallions.'],
  },
  {
    id: 'napa_tofu_soup', name: 'Napa cabbage & tofu soup', kind: 'soup', cuisine: 'Chinese', minutes: 15,
    items: { napa: 200, tofu: 200, ginger: 5 },
    steps: ['Boil 3 cups water with ginger slices.', 'Add the sliced napa and cubed tofu, and simmer for 8 minutes.', 'Season with salt and white pepper.'],
  },
  {
    id: 'mushroom_soup', name: 'Creamy mushroom soup', kind: 'soup', cuisine: 'Western', minutes: 25,
    items: { mushroom: 200, onion: 100, milk: 200, garlic: 5 },
    steps: ['Soften the onion and garlic in butter or oil, then add the sliced mushrooms and cook until browned.', 'Add 1 cup water and simmer for 10 minutes.', 'Add the milk, blend half of the soup, and season.'],
  },
  {
    id: 'spinach_egg_soup', name: 'Spinach & egg soup', kind: 'soup', cuisine: 'Chinese', minutes: 10,
    items: { spinach: 150, eggs: 100, ginger: 5 },
    steps: ['Boil 3 cups water with ginger.', 'Add the spinach and cook for 1 minute.', 'Drizzle in the beaten eggs and season.'],
  },
  {
    id: 'borscht', name: 'Chinese-style borscht (luó sòng tāng)', kind: 'soup', cuisine: 'Chinese', minutes: 75,
    items: { beef: 150, cabbage: 200, tomato: 200, carrot: 100, potato: 150, onion: 100 },
    steps: ['Simmer the cubed beef in 5 cups water for 40 minutes.', 'Fry the onion and tomato into a paste, then add it to the pot.', 'Add the carrot, potato and cabbage, and simmer for 25 minutes.', 'Season with salt and pepper. It tastes even better the next day.'],
  },
  // ---------- Saturday one-pot lunches ----------
  {
    id: 'egg_fried_rice', name: 'Egg fried rice with carrot & cabbage', kind: 'onepot', cuisine: 'Chinese', minutes: 15,
    items: { eggs: 150, carrot: 100, cabbage: 150, scallion: 15, rice: 400, soy_sauce: 15 },
    steps: ['Use day-old cooked rice. Dice the carrot and shred the cabbage.', 'Scramble the eggs and set them aside.', 'Stir-fry the carrot and cabbage for 2 minutes, then add the rice and toss on high heat.', 'Return the eggs, season with soy sauce and salt, and finish with scallions.'],
  },
  {
    id: 'cabbage_fried_noodles', name: 'Pork, cabbage & carrot fried noodles', kind: 'onepot', cuisine: 'Chinese', minutes: 20,
    items: { pork: 120, cabbage: 200, carrot: 80, noodles: 250, soy_sauce: 20, oyster_sauce: 10 },
    steps: ['Cook the noodles until just tender, then drain and toss with a little oil.', 'Stir-fry the sliced pork until browned.', 'Add the shredded cabbage and carrot, and cook for 2 minutes.', 'Add the noodles, soy sauce and oyster sauce, and toss on high heat.'],
  },
  {
    id: 'napa_egg_noodle_soup', name: 'Napa, tofu & egg noodle soup', kind: 'onepot', cuisine: 'Chinese', minutes: 15,
    items: { napa: 200, tofu: 150, eggs: 100, noodles: 200, ginger: 5, scallion: 10 },
    steps: ['Boil 4 cups water with ginger slices.', 'Add the noodles, sliced napa and cubed tofu, and simmer for 5 minutes.', 'Crack in the eggs and poach for 3 minutes.', 'Season with soy sauce and salt, and top with scallions.'],
  },
  {
    id: 'tomato_egg_noodles', name: 'Tomato & egg noodles', kind: 'onepot', cuisine: 'Chinese', minutes: 15,
    items: { tomato: 250, eggs: 150, noodles: 250, scallion: 10 },
    steps: ['Scramble the eggs and set them aside.', 'Cook the tomato wedges into a sauce with 1 tsp sugar and 1 cup water.', 'Add the cooked noodles and eggs, and toss.', 'Season and top with scallions.'],
  },
  {
    id: 'beef_noodle_soup', name: 'Beef & napa noodle soup', kind: 'onepot', cuisine: 'Chinese', minutes: 25,
    items: { beef: 150, napa: 150, noodles: 250, ginger: 5, scallion: 10, soy_sauce: 20 },
    steps: ['Slice the beef thin.', 'Boil 4 cups water with ginger and soy sauce, then add the noodles and napa.', 'Add the beef for the last minute only, so it stays tender.', 'Top with scallions.'],
  },
  {
    id: 'celery_tofu_fried_rice', name: 'Celery, tofu & egg fried rice', kind: 'onepot', cuisine: 'Chinese', minutes: 15,
    items: { celery: 120, tofu: 150, eggs: 100, onion: 80, rice: 400, soy_sauce: 15 },
    steps: ['Dice the celery, onion and tofu. Use day-old cooked rice.', 'Scramble the eggs and set them aside.', 'Fry the tofu until golden, then add the onion and celery.', 'Add the rice and eggs, and season with soy sauce.'],
  },
]

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]))
