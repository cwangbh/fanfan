import { useCallback, useEffect, useMemo, useState } from 'react'
import { MoreTab } from './components/MoreTab.tsx'
import { PrepTab } from './components/PrepTab.tsx'
import { RecipeForm } from './components/RecipeForm.tsx'
import { RecipesTab } from './components/RecipesTab.tsx'
import { RecipeView } from './components/RecipeView.tsx'
import { ShoppingTab } from './components/ShoppingTab.tsx'
import { Sheet } from './components/ui.tsx'
import { Welcome } from './components/Welcome.tsx'
import { WeekTab } from './components/WeekTab.tsx'
import { saveWeek, setCheck, setRecipeFlags, useHouseholdData } from './lib/data.ts'
import {
  addDays,
  computeWeek,
  dishName,
  formatWeek,
  generatePlan,
  recentRecipeIds,
  weekStartOf,
  type CatalogRecipe,
  type DishView,
  type WeekPlan,
} from './lib/planner.ts'
import { useStore } from './lib/store.ts'

type Tab = 'week' | 'shop' | 'prep' | 'recipes' | 'more'
const TABS: [Tab, string, string][] = [
  ['week', '📅', 'Week'],
  ['shop', '🛒', 'Shopping'],
  ['prep', '🔪', 'Prep'],
  ['recipes', '📖', 'Recipes'],
  ['more', '⋯', 'More'],
]

function loadTab(): Tab {
  try {
    return (localStorage.getItem('tab') as Tab) || 'week'
  } catch {
    return 'week'
  }
}

const randomSeed = () => Math.floor(Math.random() * 2 ** 31)

export default function App() {
  const snap = useStore()
  if (!snap.ready) return null
  if (!snap.household) return <Welcome />
  return <Household />
}

function Household() {
  const snap = useStore()
  const data = useHouseholdData(snap)
  const { catalog, people, weeks, checks } = data
  const [thisWeek] = useState(() => weekStartOf(new Date()))

  const [tab, setTab] = useState<Tab>(loadTab)
  const [weekStart, setWeekStart] = useState(thisWeek)
  const [openRecipe, setOpenRecipe] = useState<{ id: string; dish?: DishView } | null>(null)
  const [form, setForm] = useState<{ initial?: CatalogRecipe } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem('tab', tab)
    } catch {
      /* private mode */
    }
    window.scrollTo(0, 0)
  }, [tab])

  const plan = weeks[weekStart]
  const view = useMemo(() => (plan ? computeWeek(plan, catalog, people) : undefined), [plan, catalog, people])

  const generate = useCallback(
    (start: string) => {
      try {
        setError(null)
        const recent = recentRecipeIds(Object.values(weeks), start)
        saveWeek(generatePlan({ catalog, weekStart: start, seed: randomSeed(), recent }))
      } catch (e) {
        setError((e as Error).message)
      }
    },
    [catalog, weeks],
  )

  const swap = (slotIndex: number, recipeId: string) => {
    if (!plan) return
    saveWeek({ ...plan, slots: plan.slots.map((s, i) => (i === slotIndex ? { ...s, recipeId } : s)) })
  }

  const reuseWeek = (from: WeekPlan) => {
    if (weeks[thisWeek] && !confirm(`Replace this week's plan with the week of ${formatWeek(from.weekStart)}?`)) return
    saveWeek({ ...from, weekStart: thisWeek })
    setWeekStart(thisWeek)
    setTab('week')
  }

  const recipe = openRecipe ? catalog.byId[openRecipe.id] : undefined
  const status = snap.status
  const dotClass = !status.online ? 'offline' : status.error ? 'error' : status.pending ? 'pending' : ''
  const needsPlan = tab === 'week' || tab === 'shop' || tab === 'prep'

  return (
    <div className="app">
      <header className="topbar">
        <h1>🥢 饭饭</h1>
        <div className="week-switch">
          <button className="icon-btn" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            ‹
          </button>
          <button className="link-btn" onClick={() => setWeekStart(thisWeek)} title="Go to this week">
            <span>{formatWeek(weekStart)}</span>
          </button>
          <button className="icon-btn" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            ›
          </button>
        </div>
        <button
          className="icon-btn"
          aria-label="Sync status"
          title={status.online ? (status.error ?? `${status.pending} changes waiting`) : 'Offline'}
          onClick={() => setTab('more')}
        >
          <span className={`sync-dot ${dotClass}`} style={{ display: 'block' }} />
        </button>
      </header>

      <main className="stack">
        {error && <div className="notice">{error}</div>}

        {needsPlan && !plan && (
          <div className="card empty stack">
            <h2>{weekStart === thisWeek ? 'No plan for this week yet' : `No plan for ${formatWeek(weekStart)}`}</h2>
            <p className="muted small" style={{ margin: 0 }}>
              It picks 15 dishes that share ingredients, sized to your targets, ordered so nothing spoils.
            </p>
            <button className="btn primary" onClick={() => generate(weekStart)}>
              Plan this week
            </button>
          </div>
        )}

        {tab === 'week' && plan && view && (
          <WeekTab
            plan={plan}
            view={view}
            catalog={catalog}
            people={people}
            onOpenDish={(d) => setOpenRecipe({ id: d.recipe.id, dish: d })}
            onSwap={swap}
            onRegenerate={() => {
              if (confirm('Make a new plan for this week? Your shopping and prep ticks for this week will no longer match.')) generate(weekStart)
            }}
          />
        )}
        {tab === 'shop' && view && <ShoppingTab weekStart={weekStart} view={view} checks={checks} onCheck={setCheck} />}
        {tab === 'prep' && view && <PrepTab weekStart={weekStart} view={view} checks={checks} onCheck={setCheck} />}
        {tab === 'recipes' && (
          <RecipesTab catalog={catalog} view={view} onOpen={(r, dish) => setOpenRecipe({ id: r.id, dish })} onAdd={() => setForm({})} />
        )}
        {tab === 'more' && (
          <MoreTab
            snap={snap}
            people={people}
            catalog={catalog}
            weeks={weeks}
            view={view}
            currentWeek={thisWeek}
            onOpenWeek={(w) => {
              setWeekStart(w)
              setTab('week')
            }}
            onReuseWeek={reuseWeek}
          />
        )}
      </main>

      <nav className="tabbar" aria-label="Sections">
        {TABS.map(([t, icon, label]) => (
          <button key={t} className={tab === t ? 'active' : ''} aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)}>
            <span className="icon" aria-hidden>
              {icon}
            </span>
            {label}
          </button>
        ))}
      </nav>

      {recipe && (
        <Sheet
          title={dishName(recipe)}
          onClose={() => setOpenRecipe(null)}
          actions={
            <button
              className="icon-btn"
              aria-label={recipe.favourite ? 'Remove from favourites' : 'Add to favourites'}
              onClick={() => setRecipeFlags(recipe, { favourite: !recipe.favourite })}
            >
              {recipe.favourite ? '⭐' : '☆'}
            </button>
          }
        >
          <RecipeView recipe={recipe} dish={openRecipe?.dish} catalog={catalog} />
          <div className="row wrap" style={{ marginTop: 12 }}>
            <button className="btn small" onClick={() => setRecipeFlags(recipe, { hidden: !recipe.hidden })}>
              {recipe.hidden ? 'Use in planning again' : 'Hide from planning'}
            </button>
            <span className="spacer" />
            <button
              className="btn small"
              onClick={() => {
                setOpenRecipe(null)
                setForm({ initial: recipe })
              }}
            >
              {recipe.custom ? 'Edit' : 'Copy & edit'}
            </button>
          </div>
        </Sheet>
      )}

      {form && <RecipeForm catalog={catalog} initial={form.initial} onClose={() => setForm(null)} />}
    </div>
  )
}
