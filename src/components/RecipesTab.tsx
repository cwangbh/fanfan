import { useMemo, useState } from 'react'
import type { DishKind } from '../data/recipes.ts'
import { setRecipeFlags } from '../lib/data.ts'
import { DAY_NAMES, KIND_LABELS, dishName, type Catalog, type CatalogRecipe, type DishView, type WeekView } from '../lib/planner.ts'

type Filter = 'all' | DishKind | 'fav' | 'mine' | 'hidden'
const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['main', 'Mains'],
  ['veg', 'Vegetables'],
  ['soup', 'Soups'],
  ['onepot', 'One-pot'],
  ['fav', '⭐ Favourites'],
  ['mine', 'Mine'],
  ['hidden', 'Hidden'],
]

interface Props {
  catalog: Catalog
  view?: WeekView
  onOpen: (r: CatalogRecipe, dish?: DishView) => void
  onAdd: () => void
}

export function RecipesTab({ catalog, view, onOpen, onAdd }: Props) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return catalog.recipes
      .filter((r) => {
        if (filter === 'hidden') return r.hidden
        if (r.hidden && filter !== 'mine') return false
        if (filter === 'fav') return r.favourite
        if (filter === 'mine') return r.custom
        if (filter !== 'all') return r.kind === filter
        return true
      })
      .filter(
        (r) =>
          !needle ||
          r.name.toLowerCase().includes(needle) ||
          r.zh?.includes(needle) ||
          Object.keys(r.items).some((id) => catalog.ingredients[id]?.name.toLowerCase().includes(needle)),
      )
      .sort((a, b) => Number(!!b.favourite) - Number(!!a.favourite) || dishName(a).localeCompare(dishName(b), 'zh'))
  }, [catalog, q, filter])

  return (
    <div className="stack">
      <button className="btn primary block" onClick={onAdd}>
        + Add recipe
      </button>

      {view && (
        <section className="card">
          <h3 style={{ marginBottom: 4 }}>This week</h3>
          <ul className="list">
            {view.dishes.map((d) => (
              <li key={d.index} className="row">
                <span className={`kind-dot kind-${d.slot}`} style={{ marginTop: 0 }} />
                <button className="link-btn" style={{ flex: 1 }} onClick={() => onOpen(d.recipe, d)}>
                  {dishName(d.recipe)}
                </button>
                <span className="tiny muted">{DAY_NAMES[d.day]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card stack">
        <div className="row">
          <h3>All recipes</h3>
          <span className="spacer" />
          <span className="tiny muted">{catalog.recipes.length} total</span>
        </div>
        <input type="search" placeholder="Search dishes or ingredients" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          {FILTERS.map(([f, label]) => (
            <button key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {label}
            </button>
          ))}
        </div>
        <ul className="list">
          {list.map((r) => (
            <li key={r.id} className="row">
              <span className={`kind-dot kind-${r.kind}`} style={{ marginTop: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <button className="link-btn" onClick={() => onOpen(r)}>
                  {dishName(r)}
                </button>
                <div className="tiny muted">
                  {r.zh && `${r.name} · `}
                  {KIND_LABELS[r.kind]} · {r.cuisine} · {r.minutes} min{r.custom ? ' · mine' : ''}
                  {r.hidden ? ' · hidden' : ''}
                </div>
              </div>
              <button
                className="icon-btn"
                aria-label={r.favourite ? 'Remove from favourites' : 'Add to favourites'}
                aria-pressed={!!r.favourite}
                onClick={() => setRecipeFlags(r, { favourite: !r.favourite })}
              >
                {r.favourite ? '⭐' : '☆'}
              </button>
            </li>
          ))}
          {!list.length && <li className="muted small">No recipes match.</li>}
        </ul>
      </section>
    </div>
  )
}
