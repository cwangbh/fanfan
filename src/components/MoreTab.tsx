import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { savePeople } from '../lib/data.ts'
import { ACTIVITY_FACTORS, householdTargets, type Activity, type Person, type Sex } from '../lib/nutrition.ts'
import { formatGrams, formatWeek, mostCooked, PLANNED_MEAL_SHARE, type Catalog, type WeekPlan, type WeekView } from '../lib/planner.ts'
import { exportFile, householdLink, importFile, leaveHousehold, syncNow, type Snapshot } from '../lib/store.ts'
import { Progress, Segmented } from './ui.tsx'

type Section = 'targets' | 'history' | 'settings'

interface Props {
  snap: Snapshot
  people: Person[]
  catalog: Catalog
  weeks: Record<string, WeekPlan>
  view?: WeekView
  currentWeek: string
  onOpenWeek: (weekStart: string) => void
  onReuseWeek: (plan: WeekPlan) => void
}

export function MoreTab(props: Props) {
  const [section, setSection] = useState<Section>(() => (sessionStorage.getItem('more') as Section) || 'targets')
  useEffect(() => sessionStorage.setItem('more', section), [section])
  return (
    <div className="stack">
      <Segmented
        value={section}
        onChange={setSection}
        options={[
          ['targets', 'Targets'],
          ['history', 'History'],
          ['settings', 'Settings'],
        ]}
      />
      {section === 'targets' && <TargetsView people={props.people} view={props.view} />}
      {section === 'history' && <HistoryView {...props} />}
      {section === 'settings' && <SettingsView snap={props.snap} />}
    </div>
  )
}

// ---------- Targets ----------

function TargetsView({ people, view }: { people: Person[]; view?: WeekView }) {
  const ht = householdTargets(people)
  const change = (i: number, patch: Partial<Person>) => savePeople(people.map((p, j) => (j === i ? { ...p, ...patch } : p)))

  return (
    <>
      {people.map((p, i) => (
        <section key={i} className="card stack" style={{ gap: 10 }}>
          <div className="row">
            <input
              type="text"
              aria-label="Name"
              className={i === 0 ? 'her' : 'him'}
              style={{ fontWeight: 700, maxWidth: 160 }}
              value={p.name}
              onChange={(e) => change(i, { name: e.target.value })}
            />
            <span className="spacer" />
            <span className="badge accent">{ht.perPerson[i].kcal} kcal/day</span>
          </div>
          <div className="grid-3">
            <label className="field">
              Weight kg
              <NumberInput value={p.weightKg} decimal={true} onCommit={(v) => change(i, { weightKg: v })} />
            </label>
            <label className="field">
              Height cm
              <NumberInput value={p.heightCm} decimal={false} onCommit={(v) => change(i, { heightCm: v })} />
            </label>
            <label className="field">
              Age
              <NumberInput value={p.age} decimal={false} onCommit={(v) => change(i, { age: v })} />
            </label>
          </div>
          <div className="grid-2">
            <label className="field">
              Sex
              <select value={p.sex} onChange={(e) => change(i, { sex: e.target.value as Sex })}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
            <label className="field">
              Activity
              <select value={p.activity} onChange={(e) => change(i, { activity: e.target.value as Activity })}>
                {(Object.keys(ACTIVITY_FACTORS) as Activity[]).map((a) => (
                  <option key={a} value={a}>
                    {ACTIVITY_FACTORS[a].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      ))}

      <section className="card">
        <h3 style={{ marginBottom: 6 }}>Daily targets</h3>
        <table>
          <thead>
            <tr>
              <th>Per day</th>
              {people.map((p, i) => (
                <th key={i} className={i === 0 ? 'her' : 'him'}>
                  {p.name}
                </th>
              ))}
              <th>Both / week</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Protein</td>
              {ht.perPerson.map((t, i) => (
                <td key={i}>{t.protein} g</td>
              ))}
              <td>{formatGrams(ht.week.protein)}</td>
            </tr>
            <tr>
              <td>Vegetables</td>
              {ht.perPerson.map((t, i) => (
                <td key={i}>{t.veg} g</td>
              ))}
              <td>{formatGrams(ht.week.veg)}</td>
            </tr>
            <tr>
              <td>Fruit</td>
              {ht.perPerson.map((t, i) => (
                <td key={i}>{t.fruit} g</td>
              ))}
              <td>{formatGrams(ht.week.fruit)}</td>
            </tr>
          </tbody>
        </table>
        <p className="tiny muted" style={{ marginBottom: 0 }}>
          Protein 1.2 g/kg. Vegetables and fruit follow the Chinese Dietary Guidelines. About 65% of protein comes from meat, fish, eggs and
          tofu, and the rest from rice, noodles and milk. Shared dishes are split {Math.round((view?.shares[0] ?? 0.5) * 100)} /{' '}
          {Math.round((view?.shares[1] ?? 0.5) * 100)}.
        </p>
      </section>

      {view && (
        <section className="card stack">
          <h3>This week's plan vs targets</h3>
          <p className="tiny muted" style={{ margin: 0 }}>
            Planned meals: {Math.round(PLANNED_MEAL_SHARE * 14)} of 14 lunches and dinners.
          </p>
          <Progress label="Protein from meat, fish, eggs & tofu" value={view.totals.proteinFoods} target={view.targets.proteinFoods} />
          <Progress label="Vegetables" value={view.totals.veg} target={view.targets.veg} />
          <Progress label="Fruit (7 days)" value={view.totals.fruit} target={view.targets.fruit} />
        </section>
      )}
    </>
  )
}

/** Number field that lets you clear and retype; saves only valid positive numbers. */
function NumberInput({ value, decimal, onCommit }: { value: number; decimal?: boolean; onCommit: (v: number) => void }) {
  const [draft, setDraft] = useState(String(value))
  const [focused, setFocused] = useState(false)
  const shown = focused ? draft : String(value)
  return (
    <input
      type="number"
      inputMode={decimal ? 'decimal' : 'numeric'}
      value={shown}
      onFocus={() => {
        setDraft(String(value))
        setFocused(true)
      }}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        setDraft(e.target.value)
        const v = Number(e.target.value)
        if (v > 0 && v < 300) onCommit(v)
      }}
    />
  )
}

// ---------- History ----------

function HistoryView({ weeks, catalog, currentWeek, onOpenWeek, onReuseWeek }: Props) {
  const list = Object.values(weeks).sort((a, b) => b.weekStart.localeCompare(a.weekStart))
  const top = mostCooked(list, catalog)

  return (
    <>
      <section className="card">
        <h3 style={{ marginBottom: 4 }}>Past weeks</h3>
        {list.length ? (
          <ul className="list">
            {list.map((w) => (
              <li key={w.weekStart} className="stack" style={{ gap: 6 }}>
                <div className="row">
                  <b>{formatWeek(w.weekStart)}</b>
                  {w.weekStart === currentWeek && <span className="badge accent">this week</span>}
                  <span className="spacer" />
                  <button className="btn small" onClick={() => onOpenWeek(w.weekStart)}>
                    View
                  </button>
                  {w.weekStart !== currentWeek && (
                    <button className="btn small" onClick={() => onReuseWeek(w)}>
                      Reuse
                    </button>
                  )}
                </div>
                <div className="tiny muted">
                  {w.slots
                    .filter((s) => s.slot === 'main')
                    .map((s) => catalog.byId[s.recipeId]?.name ?? 'Deleted recipe')
                    .join(' · ')}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="small muted">No weeks yet.</p>
        )}
      </section>

      {top.length > 0 && (
        <section className="card">
          <h3 style={{ marginBottom: 4 }}>Most cooked</h3>
          <ul className="list">
            {top.map(({ recipe, count }) => (
              <li key={recipe.id} className="row">
                <span>{recipe.name}</span>
                <span className="spacer" />
                <span className="badge">{count}×</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

// ---------- Settings ----------

const LAST_EXPORT = 'last-export-at'

function SettingsView({ snap }: { snap: Snapshot }) {
  const link = householdLink(snap.household!)
  const [qr, setQr] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [lastExport, setLastExport] = useState(() => {
    try {
      return Number(localStorage.getItem(LAST_EXPORT)) || 0
    } catch {
      return 0
    }
  })
  const { status } = snap

  useEffect(() => {
    QRCode.toDataURL(link, { margin: 1, width: 360 }).then(setQr, () => setQr(''))
  }, [link])

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setMessage('Link copied.')
    } catch {
      setMessage('Copy failed. Select the link and copy it by hand.')
    }
  }

  async function doExport() {
    const text = JSON.stringify(exportFile(), null, 2)
    const name = `fanfan-backup-${new Date().toISOString().slice(0, 10)}.json`
    const file = new File([text], name, { type: 'application/json' })
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Fanfan backup' })
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(file)
        a.download = name
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      }
      const now = Date.now()
      try {
        localStorage.setItem(LAST_EXPORT, String(now))
      } catch {
        /* private mode */
      }
      setLastExport(now)
      setMessage('Backup created. On iPhone, choose “Save to Files”, then iCloud Drive.')
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setMessage(`Export failed: ${(e as Error).message}`)
    }
  }

  async function doImport(f: File) {
    try {
      const text = await f.text()
      if (!confirm('Replace all household data on both phones with this backup?')) return
      const n = importFile(text)
      setMessage(`Restored ${n} records from the backup.`)
    } catch (e) {
      setMessage((e as Error).message)
    }
  }

  const [now] = useState(() => Date.now())
  const daysSinceExport = lastExport ? Math.floor((Math.max(now, lastExport) - lastExport) / 86_400_000) : null
  const statusText = !status.online
    ? `Offline${status.pending ? `, ${status.pending} change${status.pending > 1 ? 's' : ''} waiting` : ''}`
    : status.error
      ? `Sync error: ${status.error}`
      : status.syncing
        ? 'Syncing…'
        : status.lastSync
          ? `Synced ${new Date(status.lastSync).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
          : 'Not synced yet'

  return (
    <>
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}

      <section className="card stack">
        <h3>Household link</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Open this link on the other phone to share recipes, plans and ticks. Anyone with the link can see and edit your data, so keep it
          private.
        </p>
        {qr && <img className="qr" src={qr} alt="QR code of the household link" />}
        <div className="code">{link}</div>
        <div className="row wrap">
          <button className="btn small" onClick={copy}>
            Copy link
          </button>
          {'share' in navigator && (
            <button className="btn small" onClick={() => navigator.share({ title: '饭饭 Fanfan', url: link }).catch(() => {})}>
              Share…
            </button>
          )}
        </div>
        <p className="tiny muted" style={{ margin: 0 }}>
          iPhone tip: an app added to the Home Screen keeps its own storage. The first time you open it from the Home Screen, choose “Join”
          and paste this link.
        </p>
      </section>

      <section className="card stack">
        <div className="row">
          <h3>Sync</h3>
          <span className="spacer" />
          <span className={`badge${status.error ? ' warn' : ' accent'}`}>{statusText}</span>
        </div>
        <button className="btn small" style={{ alignSelf: 'flex-start' }} onClick={() => void syncNow()}>
          Sync now
        </button>
      </section>

      <section className="card stack">
        <h3>iCloud backup</h3>
        {(daysSinceExport === null || daysSinceExport >= 30) && (
          <div className="notice">
            {daysSinceExport === null ? 'No backup from this phone yet.' : `Last backup ${daysSinceExport} days ago.`} Back up now.
          </div>
        )}
        <p className="small muted" style={{ margin: 0 }}>
          Export saves everything to one file. Save it to Files → iCloud Drive. Import restores it on any phone.
          {daysSinceExport !== null && daysSinceExport < 30 && ` Last backup: ${daysSinceExport === 0 ? 'today' : `${daysSinceExport} days ago`}.`}
        </p>
        <div className="row wrap">
          <button className="btn primary small" onClick={doExport}>
            Export backup
          </button>
          <button className="btn small" onClick={() => fileInput.current?.click()}>
            Import backup
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void doImport(f)
              e.target.value = ''
            }}
          />
        </div>
      </section>

      <section className="card stack">
        <h3>This phone</h3>
        <button
          className="btn danger small"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => {
            if (confirm('Disconnect this phone from the household? The data stays on the server and on the other phone.')) leaveHousehold()
          }}
        >
          Leave household on this phone
        </button>
      </section>
    </>
  )
}
