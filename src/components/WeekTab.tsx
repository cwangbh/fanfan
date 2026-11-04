import { useState } from 'react'
import { addDays, DAY_NAMES, dishName, fromISO, KIND_LABELS, swapOptions, type Catalog, type DishView, type WeekPlan, type WeekView } from '../lib/planner.ts'
import type { Person } from '../lib/nutrition.ts'

interface Props {
  plan: WeekPlan
  view: WeekView
  catalog: Catalog
  people: Person[]
  onOpenDish: (d: DishView) => void
  onSwap: (slotIndex: number, recipeId: string) => void
  onRegenerate: () => void
}

export function WeekTab({ plan, view, catalog, people, onOpenDish, onSwap, onRegenerate }: Props) {
  const [swapping, setSwapping] = useState<number | null>(null)

  const dishRow = (d: DishView) => (
    <div key={d.index} className="dish">
      <span className={`kind-dot kind-${d.slot}`} title={KIND_LABELS[d.slot]} />
      <div className="dish-body">
        <div className="row">
          <button className="link-btn" onClick={() => onOpenDish(d)}>
            {d.recipe.favourite && '⭐ '}
            {dishName(d.recipe)}
          </button>
          <span className="spacer" />
          <button className="btn small" onClick={() => setSwapping(swapping === d.index ? null : d.index)} aria-expanded={swapping === d.index}>
            Swap
          </button>
        </div>
        <div className="tiny muted">
          {d.recipe.zh && <>{d.recipe.name} · </>}
          {KIND_LABELS[d.slot]} · {d.recipe.minutes} min · <span className="her">{d.portion[0]} g</span> / <span className="him">{d.portion[1]} g</span>
          {d.cookDay !== d.day
            ? ` · 🍲 cooked Sunday, reheat${d.store === 'freezer' ? ' · ❄️ thaw the night before' : ''}`
            : d.batch === 2 && ' · cook double'}
        </div>
        {swapping === d.index && (
          <SwapList
            plan={plan}
            index={d.index}
            catalog={catalog}
            onPick={(id) => {
              onSwap(d.index, id)
              setSwapping(null)
            }}
          />
        )}
      </div>
    </div>
  )

  return (
    <div className="stack">
      <div className="stat-row">
        <div className="stat">
          <b>{view.dishes.length}</b>
          <span className="tiny muted">dishes</span>
        </div>
        <div className="stat">
          <b>{view.freshCount}</b>
          <span className="tiny muted">fresh ingredients</span>
        </div>
        <div className="stat">
          <b>12</b>
          <span className="tiny muted">meals planned</span>
        </div>
      </div>

      {view.warnings.length > 0 && (
        <div className="notice">
          <b>Check this week</b>
          <ul>
            {view.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {DAY_NAMES.map((name, day) => {
        const date = fromISO(addDays(plan.weekStart, day))
        const dishes = view.byDay[day]
        const dinner = dishes.filter((d) => d.slot !== 'onepot')
        const lunchDish = dishes.find((d) => d.slot === 'onepot')
        const boxes = view.boxes.filter((b) => b.eatDay === day)
        const fruit = view.fruitByDay[day]
        return (
          <section key={day} className="card" aria-label={name}>
            <div className="card-head">
              <h2>{name}</h2>
              <span className="muted small">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <span className="spacer" />
              {day === 0 && <span className="badge accent">🛒 Shop, prep & cook ahead</span>}
              {day === 5 && <span className="badge">🥡 Takeout night</span>}
            </div>

            <div className="section-title">Lunch</div>
            {boxes.length > 0 ? (
              <div className="box-grid">
                {boxes.map((b) => (
                  <div key={b.person} className="box">
                    <span className={b.person === 0 ? 'her' : 'him'}>🍱 {people[b.person]?.name}</span>
                    <ul>
                      {b.items.map((it) => (
                        <li key={it.name}>
                          {it.name} <b>{it.g} g</b>
                        </li>
                      ))}
                      <li>
                        Rice <b>{b.riceG} g</b>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            ) : lunchDish ? (
              dishRow(lunchDish)
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                Not planned
              </p>
            )}

            <div className="section-title">Dinner</div>
            {day === 5 ? (
              <p className="small muted" style={{ margin: 0 }}>
                Takeout: nothing to cook. Enjoy!
              </p>
            ) : (
              <>
                {dinner.map(dishRow)}
                {day <= 4 && <p className="tiny muted" style={{ margin: '4px 0 0' }}>{dinnerHint(dinner, day)}</p>}
              </>
            )}

            {fruit && (
              <>
                <div className="section-title">Fruit</div>
                <div className="small">
                  🍎 {fruit.name}: <span className="her">{fruit.g[0]} g</span> · <span className="him">{fruit.g[1]} g</span>
                </div>
              </>
            )}
          </section>
        )
      })}

      <button className="btn block" onClick={onRegenerate}>
        🔀 Regenerate the whole week
      </button>
    </div>
  )
}

function dinnerHint(dinner: DishView[], day: number): string {
  const reheat = dinner.filter((d) => d.cookDay !== d.day).map((d) => dishName(d.recipe))
  const fresh = dinner.filter((d) => d.cookDay === d.day && d.slot !== 'soup').map((d) => dishName(d.recipe))
  const pack = `pack half of the main and the vegetable dish into ${DAY_NAMES[day + 1]}'s lunch boxes.`
  if (!reheat.length) return `After dinner, ${pack}`
  return `Reheat ${reheat.join(', ')}. Cook ${fresh.join(', ') || 'the rest'} fresh. After dinner, ${pack}`
}

function SwapList({ plan, index, catalog, onPick }: { plan: WeekPlan; index: number; catalog: Catalog; onPick: (id: string) => void }) {
  const options = swapOptions(plan, index, catalog).slice(0, 10)
  if (!options.length) return <p className="small muted">No other dish of this type can be cooked on this day.</p>
  return (
    <div className="swap-list">
      {options.map((o) => (
        <button key={o.recipe.id} onClick={() => onPick(o.recipe.id)}>
          <span style={{ flex: 1 }}>
            {o.recipe.favourite && '⭐ '}
            {dishName(o.recipe)}
          </span>
          <span className={`badge${o.newCount === 0 ? ' accent' : ''}`}>{o.newCount === 0 ? 'nothing new' : `+${o.newCount} to buy`}</span>
        </button>
      ))}
    </div>
  )
}
