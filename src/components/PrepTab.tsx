import type { WeekView } from '../lib/planner.ts'
import { Check } from './ui.tsx'

interface Props {
  weekStart: string
  view: WeekView
  checks: Record<string, boolean>
  onCheck: (key: string, v: boolean) => void
}

export function PrepTab({ weekStart, view, checks, onCheck }: Props) {
  const key = (id: string) => `${weekStart}:prep:${id}`
  const all = view.prep.flatMap((s) => s.items)
  const done = all.filter((i) => checks[key(i.id)]).length

  return (
    <div className="stack">
      <div className="card">
        <div className="row">
          <h2>Sunday prep</h2>
          <span className="spacer" />
          <span className="badge accent">
            {done} / {all.length}
          </span>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Do this right after shopping. Start the longest cook-ahead dish first, then portion and store the rest while it
          simmers. It takes about 2½–3 hours, and Mon–Thu dinners become reheat + one quick vegetable dish.
        </p>
      </div>

      {view.prep.map((s) => (
        <section key={s.id} className="card">
          <h3 style={{ marginBottom: 4 }}>{s.title}</h3>
          <ul className="list">
            {s.items.map((it) => (
              <li key={it.id}>
                <Check checked={!!checks[key(it.id)]} onChange={(v) => onCheck(key(it.id), v)}>
                  <span className="small">{it.text}</span>
                </Check>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="card">
        <h3 style={{ marginBottom: 4 }}>❄️ Thaw schedule</h3>
        {view.thaw.length ? (
          <ul className="list">
            {view.thaw.map((t, i) => (
              <li key={i} className="small">
                <b>{t.when}:</b> {t.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="small muted">Nothing needs thawing this week.</p>
        )}
      </section>
    </div>
  )
}
