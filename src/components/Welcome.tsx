import { useState } from 'react'
import { parseHouseholdInput } from '../lib/sync.ts'
import { createHousehold, joinHousehold } from '../lib/store.ts'

export function Welcome() {
  const [link, setLink] = useState('')
  const id = parseHouseholdInput(link)

  return (
    <main className="welcome">
      <div>
        <h1>🥢 饭饭 Fanfan</h1>
        <p className="muted">One Sunday shop, a week of dinners and lunch boxes for two.</p>
      </div>

      <section className="card stack">
        <h2>First phone</h2>
        <p className="small muted" style={{ margin: 0 }}>
          Create your household. You'll get a private link to open on the other phone. No account or password needed.
        </p>
        <button className="btn primary" onClick={createHousehold}>
          Create a household
        </button>
      </section>

      <section className="card stack">
        <h2>Join</h2>
        <p className="small muted" style={{ margin: 0 }}>
          Paste the household link from the other phone (Settings → Household link).
        </p>
        <input type="text" placeholder="https://…/#h=…" value={link} onChange={(e) => setLink(e.target.value)} aria-label="Household link" />
        <button className="btn" disabled={!id} onClick={() => id && joinHousehold(id)}>
          Join household
        </button>
        {link && !id && <span className="tiny muted">That doesn't look like a household link yet.</span>}
      </section>
    </main>
  )
}
