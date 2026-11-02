# 饭饭 Fanfan

*Fànfàn (饭饭) is baby-talk Chinese for "meals": 吃饭饭了, time to eat!*


A small web app that plans one week of home cooking for two people who shop **once a week, on Sunday**.
It tells you how much protein, vegetables and fruit you each need, what to buy, which
dishes to cook each day, how to pack separate lunch boxes, and how to prep and store
everything so it stays fresh until the next shop.

## Who it's for

Two people who cook together. The app ships with **example** profiles:

| Person | Sex | Weight | Height | Age | Activity |
|---|---|---|---|---|---|
| Her | F | 55 kg | 163 cm | 30 | Light |
| Him | M | 70 kg | 175 cm | 30 | Light |

Enter your own numbers under **More → Targets**. They are saved on your own server only (never in this repo),
and every number in the app updates when they change.

## Weekly rhythm

The week runs **Sunday → Saturday** and starts with the shop.

| Day | Lunch | Dinner |
|---|---|---|
| **Sun** | Not planned | 🛒 Shop + prep, then a **full dinner**, cooked with extra for Monday's lunch boxes |
| **Mon** | 🍱 Lunch boxes, eaten separately | Full dinner + extra for Tuesday's boxes |
| **Tue** | 🍱 Lunch boxes | Full dinner + extra for Wednesday's boxes |
| **Wed** | 🍱 Lunch boxes | Full dinner + extra for Thursday's boxes |
| **Thu** | 🍱 Lunch boxes | Full dinner + extra for Friday's boxes |
| **Fri** | 🍱 Lunch boxes | 🥡 Takeout (not planned) |
| **Sat** | One-pot lunch (fried rice, noodles, and so on) | **Full dinner**, single batch, no boxes needed |

- 5 double-batch cooking nights (Sun–Thu) cover 5 dinners and 5 weekday lunches for each person.
- Saturday lunch and dinner use the ingredients that last all week, plus the last frozen protein.
- **12 of the week's 14 lunches and dinners are planned.** Sunday lunch and Friday dinner are not.
- Breakfast and snacks are not planned (assumption). Fruit is eaten with breakfast, as snacks, or in the lunch box.

## Problems it solves

1. **How much should we eat?** Daily protein, vegetable and fruit targets for each person.
2. **How much should we buy?** One Sunday shopping list in grams and pieces, sized to the planned meals.
3. **What can we cook?** A Sun–Sat menu where every fresh ingredient is used in at least
   2 different dishes, so a small basket makes as many dishes as possible.
4. **How do we split lunch?** Separate lunch boxes, portioned for each person.
5. **How do we keep it fresh for 7 days?** Dishes are ordered by how fast ingredients spoil,
   and the app gives a Sunday prep checklist plus a freezer-to-fridge thaw schedule.
6. **Can we keep using it all year?** You can add your own dishes, past weeks are kept, and both
   phones stay in sync with no sign-in.

## Requirements

### R1 Nutrition targets
- Calories: Mifflin-St Jeor × activity factor (shown for reference only, not planned against).
- Protein: **1.2 g per kg** body weight per day.
- Vegetables: 300–500 g/day, fruit: 200–350 g/day (Chinese Dietary Guidelines). Where each
  person falls in the range scales with their calorie needs.
- About **65%** of protein should come from meat, fish, eggs and tofu. The rest comes from rice, noodles, milk and so on.

Results for the example profiles:

| Per day | Her | Him | Both, full week | Both, planned meals (12/14) |
|---|---|---|---|---|
| Calories | ~1,730 kcal | ~2,270 kcal | — | — |
| Protein | 66 g | 84 g | ~1,050 g (≈680 g from protein foods) | ≈585 g from protein foods |
| Vegetables | 450 g | 500 g | 6.65 kg | ≈5.7 kg |
| Fruit | 200 g | 300 g | 3.5 kg | 3.5 kg (fruit covers all 7 days) |

- **Portion split:** each shared dish is divided by the two protein targets, so by default
  with the example profiles she gets about **44%** and he gets about **56%**. This applies to dinner plates and lunch boxes.

### R2 Meals and lunch boxes
- **Sun–Thu dinner:** 1 protein main + 1 vegetable dish, plus a soup on 2 of the nights.
- Each dinner's main and vegetable dish is cooked as a **double batch**: 2 dinner portions now and
  2 lunch-box portions for the next day. Soup is eaten at dinner only and is not packed.
- **Lunch boxes:** pack them right after dinner. The app shows what goes in each person's box,
  in grams: main, vegetable dish, suggested rice, and that day's fruit.
- **Saturday lunch:** one one-pot dish (for example egg fried rice, noodle soup, curry rice), built from
  ingredients that last all week (eggs, cabbage, carrots, tofu, and so on). It can be light or hearty.
- **Saturday dinner:** a full dinner (main + vegetable dish), cooked as a single batch because Sunday lunch isn't planned.
- **Friday dinner and Sunday lunch** are shown as "not planned" and nothing is bought for them.

### R3 Sunday shopping list
- One shop on **Sunday**, with prep right after it and before Sunday dinner.
- Grouped as: Meat & Fish · Vegetables · Fruit · Aromatics · Pantry check.
- Shows total grams for both people, plus a piece hint (e.g. "1.2 kg (~8 tomatoes)", "12 eggs").
- Amounts are sized to the **planned meals** (column 5 in R1). Ingredient amounts in dishes are scaled so the
  week's totals land within **±10%** of the protein-food, vegetable and fruit targets.
- Each item has a checkbox that stays checked after a page reload.

### R4 Weekly menu
- **15 dishes:** 6 mains, 6 vegetable dishes (Sun–Thu + Sat dinner), 2 soups and 1 Saturday one-pot lunch. **No dish repeats within a week.**
- **Ingredient reuse:** every protein and vegetable you buy appears in **2 or more different dishes**.
  The app shows "N dishes from M fresh ingredients".
- **Variety:** the mains cover at least 4 protein families (chicken, pork, beef, seafood, eggs, tofu…), and no family is the
  main ingredient in more than 2 mains. At least 8 different vegetables, including at least one leafy green.
- Cuisine: **mostly Chinese home-style, plus some easy Western dishes (assumption)**. The starting database has about 45 recipes.
- **Regenerate week** creates a new menu. **Swap** replaces one dish, and lists alternatives
  ranked by how few new ingredients they add. If a swap breaks the reuse rule, the app shows a warning.

### R5 Freshness and spoilage order
Each ingredient has a "cook by" day, counted from the Sunday shop. Dishes are scheduled so nothing is cooked after that day:

| When | What to cook |
|---|---|
| Sun–Mon | Fresh fish, berries |
| Sun–Tue | Leafy greens (bok choy, spinach) |
| Tue–Wed | Mushrooms, eggplant, broccoli, green beans, zucchini; bananas/grapes |
| Thu–Sat | Cabbage, napa, carrots, celery, onions, potatoes, eggs, tofu; apples/oranges/kiwi |
| Any cooking day | Chicken, pork, beef, frozen shrimp, all frozen on Sunday |

Lunch boxes are eaten the day after cooking, which is still within the cook-by window, because cooked food keeps 3–4 days in the fridge.

### R6 Sunday prep guide
Built from the current menu:
- Portion each protein by day, marinate it, then bag, label and freeze it. Proteins for Sun and Mon dinner go in the fridge, not the freezer.
- Thaw schedule: "Mon night: move Tue's chicken thigh (500 g) to the fridge".
- How to wash and store each vegetable (leafy greens unwashed, sturdy ones washed and dried).
- Batch tasks: cook rice for 2–3 days, pre-cut Sun–Tue vegetables, make garlic-soy sauce and ginger-scallion oil
  if the menu uses them, and set out 10 lunch boxes (5 for each person).
- Each step is a checklist item that stays checked after a reload.

### R7 Recipes
- For every dish on the menu: ingredients scaled to the batch size, cooking time, and 2–4 short steps.
- The other recipes can be browsed in a collapsed section.

### R8 My recipes (add your own dishes)
- **Add, edit, or delete a recipe:** name, type (main / vegetable dish / soup / Saturday one-pot), cuisine, minutes,
  ingredients with grams for one meal for 2 people, and steps.
- Ingredients are picked from the ingredient list. If one is missing, you can **add a new ingredient** with
  its category, protein per 100 g, how many days it keeps after the Sunday shop, whether it freezes, and a storage tip.
- **Favourite** (⭐): the planner picks favourites more often. **Hide** removes a dish from planning
  without deleting it. Built-in recipes can be favourited or hidden, but not deleted.
- New recipes are used by the planner straight away and follow the same rules (R4, R5).
- If a recipe would break the reuse rule (for example it is the only dish using an ingredient),
  the planner skips it in that week. The recipe screen shows which other dishes share its ingredients.

### R9 History
- Every week's plan is kept: menu, shopping list, and what was checked off.
- **Avoid repeats:** the planner prefers dishes you haven't cooked in the last 2 weeks.
- History screen: past weeks by date, and "most cooked dishes" over the year.
- You can open a past week and reuse it as this week's plan.

### R10 Data and sync (no sign-in)
- **Household link:** on the first phone, tap **Create a household**. The phone creates a private household ID and puts it in the URL
  (`https://meals.example.com/#h=k3f9x…`, at least 128 bits of randomness). To pair the second phone, open the same link
  on it, by sharing the link or scanning a QR code from Settings, or paste the link on the app's first screen. There are no accounts or passwords.
  Anyone with the link can read and edit the data, so treat it like a private shared-album link.
- **Offline first:** each phone keeps a full copy locally (IndexedDB) and works with no signal, for example in the store.
  Changes are queued and sent when the phone is back online.
- **Sync:** each phone pulls changes when the app opens, when it comes back to the foreground, and every 10 s while open.
  It pushes changes immediately. A tick on one phone appears on the other within about 10 s.
- **Conflicts:** last write wins, per record. A record is one recipe, one ingredient, one week plan, or one checklist item.
  If both of you tick different items at the same time, both ticks are kept.
- **iCloud backup:** Settings → **Export** saves one JSON file with everything. On iPhone, the share sheet
  lets you save it to Files → iCloud Drive. **Import** restores from that file. It replaces the household data,
  after you confirm. Settings shows a monthly "back up now" reminder.
- The server only stores data. All planning runs on the phone.

## Screens
One page, designed for a phone first, with a bottom tab bar:

1. **Week**: Sun–Sat cards. Each card shows dinner (main, veg dish, soup), tomorrow's two lunch boxes with grams for each person, and the fruit of the day.
   Friday dinner shows "Takeout" and Saturday shows its lunch and full dinner. Includes Swap and Regenerate.
2. **Shopping**: the grouped checklist.
3. **Prep**: the Sunday checklist and thaw schedule.
4. **Recipes**: this week's dishes, all recipes (built-in + mine), ⭐ / hide, and **+ Add recipe** (R8).
5. **More**:
   - **Targets**: inputs for both people, daily and weekly targets, and progress bars comparing the plan to the targets.
   - **History** (R9).
   - **Settings**: household link + QR code, sync status ("Synced 2 min ago" / "Offline, 3 changes waiting"), Export / Import.

## Data model
Every record is stored as `{ household, collection, key, data (JSON), updatedAt, deleted }`.

| Collection | Key | Data |
|---|---|---|
| `profile` | `people` | both people's inputs (R1) |
| `recipes` | recipe id | user-added recipes, plus ⭐/hidden flags on built-in ones |
| `ingredients` | ingredient id | user-added ingredients |
| `weeks` | week start date (Sunday, `YYYY-MM-DD`) | menu, fruit plan, and the seed used to generate it |
| `checks` | `week:item` | shopping and prep ticks |

Built-in recipes and ingredients come with the app code. Only your own additions and changes go to the server.

## Not in scope (v1)
- User accounts, sign-in or roles. The household link is the only access control.
- Native iCloud / CloudKit sync. iCloud is only used for the manual backup file.
- Breakfast, Sunday lunch and Friday takeout planning. Calorie tracking, macros beyond protein.
- Allergies and dietary filters (could be added later).
- Grocery prices or budget.
- Units are metric only.

## Tech
- **Frontend:** React 19 + TypeScript + Vite. Plain CSS. Light and dark themes.
  `vite-plugin-pwa`: can be added to the iPhone home screen and works offline.
- **Backend:** Node 22.18+ + Hono, about 150 lines, run directly as TypeScript. It serves the built app and a JSON API.
  Data is stored in SQLite (Node's built-in `node:sqlite`, no native build needed) in a single file on a Docker volume.
- **API:**
  - There is no "create household" call. The phone generates the ID, and the server stores records under any valid ID it receives.
  - `GET  /api/households/:id/changes?since=<cursor>` returns records changed since the cursor, plus a new cursor.
  - `POST /api/households/:id/changes` upserts a batch of records (last write wins on `updatedAt`).
  - `GET  /api/households/:id/export` returns a full JSON dump. Import uses `POST …/changes`.
- Vitest unit tests for the nutrition maths, the planner rules (R2, R4, R5) and the merge/conflict logic (R10).

### Project layout
    src/data/ingredients.ts   built-in ingredients: protein/100 g, cook-by day, storage tips, piece size
    src/data/recipes.ts       built-in recipes (grams for 2 servings, steps)
    src/lib/nutrition.ts      R1 target maths
    src/lib/planner.ts        R2–R6, R9: menu generation, scheduling, scaling, lunch boxes, shopping list, prep guide
    src/lib/sync.ts           record format, validation, last-write-wins merge, backup file (shared with the server)
    src/lib/store.ts          local IndexedDB copy, change queue, sync loop, export/import (R10)
    src/lib/data.ts           household data (people, recipes, weeks, ticks) built from the synced records
    src/components/           screens
    src/App.tsx               tab shell
    server/index.ts           Hono API + static file serving
    scripts/make-icons.ts     draws the PWA icons (npm run icons)
    Dockerfile                multi-stage: build the frontend, then run the server
    docker-compose.yml        one service, port 8080, volume ./data → /data

## Run locally
    npm install
    npm run server     # API on http://localhost:8080 (data in ./data)
    npm run dev        # in a second terminal: frontend on http://localhost:5173, /api proxied to :8080
    npm test           # unit tests
    npm start          # build, then serve app + API together on :8080

## Deploy (Docker, personal server)
    docker compose up -d --build     # app + API on port 8080, data in ./data/meals.db

- **HTTPS is required:** iPhones only install a PWA and keep its offline cache over HTTPS. Put the container
  behind a reverse proxy with a certificate, for example Caddy (`meals.example.com { reverse_proxy localhost:8080 }`) or Nginx + Let's Encrypt.
- **Backup:** copy `./data/meals.db` (e.g. a nightly cron job). The iCloud export in R10 is a second backup.
- **Update:** `git pull && docker compose up -d --build`. The data stays in the volume.

## Acceptance checklist
- [ ] Default targets match the R1 table.
- [ ] Plan totals are within ±10% of the planned-meal targets for protein foods and vegetables, and of the full-week fruit target.
- [ ] The week follows the rhythm: 5 cooked dinners (Sun–Thu), 10 lunch boxes (Mon–Fri × 2), Friday takeout, Saturday one-pot lunch + full dinner.
- [ ] Lunch boxes are split about 44/56 (her/him) with the example profiles, and the split follows the protein targets when inputs change.
- [ ] 10 regenerated weeks: no repeated dishes, every fresh ingredient used in 2+ dishes,
      no fish after Monday, no leafy greens after Tuesday, no dish after its cook-by day.
- [ ] A recipe added on phone A appears on phone B within about 10 s and can be planned.
- [ ] Ticks made offline on both phones are all kept after both reconnect.
- [ ] Export → delete local data → Import gives back the same recipes, weeks and ticks.
- [ ] `docker compose up` on a clean machine serves the app. Data survives `docker compose down && up`.
- [ ] Works at 375 px phone width; installable from Safari over HTTPS.
