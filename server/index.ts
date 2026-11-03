// Fanfan server: serves the built app and a tiny sync API backed by SQLite (README R10).
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { HOUSEHOLD_RE, makeExport, validateRecord, type Rec } from '../src/lib/sync.ts'

const PORT = Number(process.env.PORT ?? 8080)
const DATA_DIR = resolve(process.env.DATA_DIR ?? './data')
const STATIC_DIR = resolve(process.env.STATIC_DIR ?? './dist')
const PAGE_SIZE = 1000
const MAX_BATCH = 2000
/** Comma-separated household ids this server serves. Unset = any valid id (first-time setup). */
const ALLOWED = new Set((process.env.FANFAN_HOUSEHOLDS ?? '').split(',').map((s) => s.trim()).filter(Boolean))
/** Writes are refused once the database file grows past this. */
const MAX_DB_BYTES = Number(process.env.FANFAN_MAX_DB_MB ?? 200) * 1024 * 1024

mkdirSync(DATA_DIR, { recursive: true })
const db = new DatabaseSync(join(DATA_DIR, 'meals.db'))
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS records (
    household  TEXT    NOT NULL,
    collection TEXT    NOT NULL,
    key        TEXT    NOT NULL,
    data       TEXT,
    updated_at INTEGER NOT NULL,
    deleted    INTEGER NOT NULL DEFAULT 0,
    seq        INTEGER NOT NULL,
    PRIMARY KEY (household, collection, key)
  );
  CREATE INDEX IF NOT EXISTS records_by_seq ON records (household, seq);
`)

// One global, increasing change counter. Clients pull "everything after cursor N".
let seq = (db.prepare('SELECT COALESCE(MAX(seq), 0) AS s FROM records').get() as { s: number }).s

const selectOne = db.prepare('SELECT updated_at FROM records WHERE household = ? AND collection = ? AND key = ?')
const upsert = db.prepare(`
  INSERT INTO records (household, collection, key, data, updated_at, deleted, seq) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT (household, collection, key) DO UPDATE SET
    data = excluded.data, updated_at = excluded.updated_at, deleted = excluded.deleted, seq = excluded.seq
`)
const selectSince = db.prepare(
  'SELECT collection, key, data, updated_at, deleted, seq FROM records WHERE household = ? AND seq > ? ORDER BY seq LIMIT ?',
)
const selectAll = db.prepare('SELECT collection, key, data, updated_at, deleted FROM records WHERE household = ? AND deleted = 0')
const dbSize = () => {
  const { page_count } = db.prepare('PRAGMA page_count').get() as { page_count: number }
  const { page_size } = db.prepare('PRAGMA page_size').get() as { page_size: number }
  return page_count * page_size
}

interface Row {
  collection: string
  key: string
  data: string | null
  updated_at: number
  deleted: number
  seq?: number
}
const toRec = (r: Row): Rec => ({
  collection: r.collection as Rec['collection'],
  key: r.key,
  data: r.data === null ? null : JSON.parse(r.data),
  updatedAt: r.updated_at,
  deleted: r.deleted === 1,
})

const app = new Hono()

app.use('/api/*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'no-store')
})

app.get('/api/health', (c) => c.json({ ok: true }))

app.use('/api/households/:id/*', async (c, next) => {
  const id = c.req.param('id') ?? ''
  if (!HOUSEHOLD_RE.test(id)) return c.json({ error: 'Invalid household id' }, 400)
  if (ALLOWED.size && !ALLOWED.has(id)) return c.json({ error: 'This server only serves its own household' }, 403)
  await next()
})

app.get('/api/households/:id/changes', (c) => {
  const since = Math.max(0, Number(c.req.query('since') ?? 0) || 0)
  const rows = selectSince.all(c.req.param('id'), since, PAGE_SIZE + 1) as unknown as Row[]
  const page = rows.slice(0, PAGE_SIZE)
  return c.json({
    records: page.map(toRec),
    cursor: page.length ? page[page.length - 1].seq : since,
    more: rows.length > PAGE_SIZE,
  })
})

app.post('/api/households/:id/changes', bodyLimit({ maxSize: 5 * 1024 * 1024 }), async (c) => {
  const household = c.req.param('id')
  if (dbSize() > MAX_DB_BYTES) return c.json({ error: 'Storage limit reached' }, 507)
  const body = (await c.req.json().catch(() => null)) as { records?: unknown[] } | null
  if (!body || !Array.isArray(body.records) || body.records.length > MAX_BATCH) {
    return c.json({ error: `Send { records: [...] } with at most ${MAX_BATCH} records` }, 400)
  }
  const records = body.records.map(validateRecord)
  if (records.some((r) => !r)) return c.json({ error: 'Invalid record' }, 400)

  let accepted = 0
  db.exec('BEGIN')
  try {
    for (const r of records as Rec[]) {
      const cur = selectOne.get(household, r.collection, r.key) as { updated_at: number } | undefined
      if (cur && cur.updated_at >= r.updatedAt) continue // last write wins
      upsert.run(household, r.collection, r.key, JSON.stringify(r.data ?? null), r.updatedAt, r.deleted ? 1 : 0, ++seq)
      accepted++
    }
    db.exec('COMMIT')
  } catch (e) {
    db.exec('ROLLBACK')
    throw e
  }
  return c.json({ ok: true, accepted })
})

app.get('/api/households/:id/export', (c) => {
  const household = c.req.param('id')
  const rows = selectAll.all(household) as unknown as Row[]
  c.header('Content-Disposition', `attachment; filename="fanfan-backup.json"`)
  return c.json(makeExport(household, rows.map(toRec)))
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

// ---------- The app itself ----------

app.use('/assets/*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'public, max-age=31536000, immutable')
})
app.use('/*', serveStatic({ root: STATIC_DIR }))
const indexHtml = join(STATIC_DIR, 'index.html')
app.get('*', (c) => (existsSync(indexHtml) ? c.html(readFileSync(indexHtml, 'utf8')) : c.text('App not built. Run npm run build.', 404)))

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Fanfan on http://localhost:${PORT} (data: ${DATA_DIR}, households: ${ALLOWED.size ? `${ALLOWED.size} allowed` : 'any'})`)
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    db.close()
    process.exit(0)
  })
}
