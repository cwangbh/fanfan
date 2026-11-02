import type { WeekView } from '../lib/planner.ts'
import { Check } from './ui.tsx'

interface Props {
  weekStart: string
  view: WeekView
  checks: Record<string, boolean>
  onCheck: (key: string, v: boolean) => void
}

export function ShoppingTab({ weekStart, view, checks, onCheck }: Props) {
  const key = (k: string) => `${weekStart}:shop:${k}`
  const all = view.shopping.flatMap((g) => g.items)
  const done = all.filter((i) => checks[key(i.key)]).length

  return (
    <div className="stack">
      <div className="card">
        <div className="row">
          <h2>Sunday shopping</h2>
          <span className="spacer" />
          <span className="badge accent">
            {done} / {all.length}
          </span>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Amounts cover all 12 planned meals for both of you. Fruit covers all 7 days.
        </p>
      </div>

      {view.shopping.map((g) => (
        <section key={g.id} className="card">
          <h3 style={{ marginBottom: 4 }}>{g.title}</h3>
          <ul className="list">
            {g.items.map((it) => (
              <li key={it.key}>
                <Check checked={!!checks[key(it.key)]} onChange={(v) => onCheck(key(it.key), v)}>
                  <div className="row" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div>{it.name}</div>
                      {it.usedIn.length > 0 && g.id !== 'pantry' && <div className="tiny muted">{it.usedIn.join(' · ')}</div>}
                      {g.id === 'pantry' && <div className="tiny muted">Used in {it.usedIn.length} dish{it.usedIn.length > 1 ? 'es' : ''}</div>}
                    </div>
                    {it.amount && (
                      <div>
                        <div className="amount">{it.amount}</div>
                        {it.hint && <div className="tiny muted" style={{ textAlign: 'right' }}>{it.hint}</div>}
                      </div>
                    )}
                  </div>
                </Check>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {done > 0 && (
        <button className="btn block" onClick={() => all.forEach((i) => checks[key(i.key)] && onCheck(key(i.key), false))}>
          Uncheck everything
        </button>
      )}
    </div>
  )
}
