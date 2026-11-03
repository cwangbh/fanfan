import { useState } from 'react'
import type { Category, Ingredient } from '../data/ingredients.ts'
import type { DishKind, Recipe } from '../data/recipes.ts'
import { deleteRecipe, newId, saveIngredient, saveRecipe } from '../lib/data.ts'
import { DAY_NAMES, KIND_LABELS, type Catalog, type CatalogRecipe } from '../lib/planner.ts'
import { Sheet } from './ui.tsx'

const CATEGORY_LABELS: Record<Category, string> = {
  protein: 'Meat, fish, eggs & tofu',
  veg: 'Vegetables',
  aromatic: 'Aromatics',
  pantry: 'Pantry',
  fruit: 'Fruit',
}
const FORM_CATEGORIES: Category[] = ['protein', 'veg', 'aromatic', 'pantry']

interface Row {
  id: string
  g: string
}

interface Props {
  catalog: Catalog
  /** Existing user recipe to edit, or a recipe to start a copy from. */
  initial?: CatalogRecipe
  onClose: () => void
}

export function RecipeForm({ catalog, initial, onClose }: Props) {
  const editing = !!initial?.custom
  const [name, setName] = useState(initial ? (editing ? initial.name : `${initial.name} (my version)`) : '')
  const [kind, setKind] = useState<DishKind>(initial?.kind ?? 'main')
  const [cuisine, setCuisine] = useState(initial?.cuisine ?? 'Chinese')
  const [minutes, setMinutes] = useState(String(initial?.minutes ?? 20))
  const [rows, setRows] = useState<Row[]>(
    initial ? Object.entries(initial.items).map(([id, g]) => ({ id, g: String(g) })) : [{ id: '', g: '' }],
  )
  const [steps, setSteps] = useState(initial?.steps.join('\n') ?? '')
  const [favourite, setFavourite] = useState(!!initial?.favourite)
  const [cookAhead, setCookAhead] = useState(!!initial?.cookAhead)
  const [addingIngredient, setAddingIngredient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ingredients = Object.values(catalog.ingredients).sort((a, b) => a.name.localeCompare(b.name))

  function save() {
    const items: Recipe['items'] = {}
    for (const r of rows) {
      const g = Number(r.g)
      if (r.id && g > 0) items[r.id] = (items[r.id] ?? 0) + g
    }
    if (!name.trim()) return setError('Give the dish a name.')
    if (!Object.keys(items).some((id) => ['protein', 'veg'].includes(catalog.ingredients[id]?.category))) {
      return setError('Add at least one protein or vegetable with grams.')
    }
    const recipe: Recipe = {
      id: editing ? initial!.id : newId('u', name),
      name: name.trim(),
      kind,
      cuisine: cuisine.trim() || 'Other',
      minutes: Math.max(1, Number(minutes) || 20),
      ...(kind === 'main' && cookAhead && { cookAhead: true }),
      items,
      steps: steps.split('\n').map((s) => s.trim()).filter(Boolean),
    }
    saveRecipe(recipe, { favourite, hidden: editing ? initial!.hidden : false })
    onClose()
  }

  return (
    <Sheet title={editing ? 'Edit recipe' : 'Add recipe'} onClose={onClose}>
      <div className="stack">
        <label className="field">
          Dish name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cumin lamb" autoFocus />
        </label>
        <div className="grid-3">
          <label className="field">
            Type
            <select value={kind} onChange={(e) => setKind(e.target.value as DishKind)}>
              {(Object.keys(KIND_LABELS) as DishKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Cuisine
            <input type="text" list="cuisines" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
            <datalist id="cuisines">
              <option value="Chinese" />
              <option value="Western" />
              <option value="Japanese" />
              <option value="Korean" />
            </datalist>
          </label>
          <label className="field">
            Minutes
            <input type="number" inputMode="numeric" min={1} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </label>
        </div>

        <div className="card flat stack" style={{ gap: 8 }}>
          <div className="row">
            <h3>Ingredients</h3>
            <span className="spacer" />
            <span className="tiny muted">grams for one meal for 2</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="ing-row">
              <select
                aria-label="Ingredient"
                value={r.id}
                onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, id: e.target.value } : x)))}
              >
                <option value="">Choose…</option>
                {FORM_CATEGORIES.map((c) => (
                  <optgroup key={c} label={CATEGORY_LABELS[c]}>
                    {ingredients
                      .filter((ing) => ing.category === c)
                      .map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <input
                aria-label="Grams"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="g"
                value={r.g}
                onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, g: e.target.value } : x)))}
              />
              <button className="icon-btn" aria-label="Remove ingredient" onClick={() => setRows(rows.filter((_, j) => j !== i))}>
                ✕
              </button>
            </div>
          ))}
          <div className="row wrap">
            <button className="btn small" onClick={() => setRows([...rows, { id: '', g: '' }])}>
              + Ingredient
            </button>
            <button className="btn small" onClick={() => setAddingIngredient(true)}>
              Missing one? Create ingredient
            </button>
          </div>
          {addingIngredient && (
            <IngredientForm
              onCancel={() => setAddingIngredient(false)}
              onSave={(ing) => {
                saveIngredient(ing)
                const empty = rows.findIndex((r) => !r.id)
                setRows(empty >= 0 ? rows.map((r, j) => (j === empty ? { ...r, id: ing.id } : r)) : [...rows, { id: ing.id, g: '' }])
                setAddingIngredient(false)
              }}
            />
          )}
        </div>

        <label className="field">
          Steps (one per line)
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} placeholder={'Slice the lamb…\nStir-fry with cumin…'} />
        </label>

        {kind === 'main' && (
          <label className="check">
            <input type="checkbox" checked={cookAhead} onChange={(e) => setCookAhead(e.target.checked)} />
            <span className="check-text">🍲 Good to cook on Sunday: it reheats and freezes well</span>
          </label>
        )}

        <label className="check">
          <input type="checkbox" checked={favourite} onChange={(e) => setFavourite(e.target.checked)} />
          <span className="check-text">⭐ Favourite: the planner picks it more often</span>
        </label>

        {error && <div className="notice">{error}</div>}

        <div className="row">
          {editing && (
            <button
              className="btn danger"
              onClick={() => {
                if (confirm(`Delete “${initial!.name}”? Weeks that used it will ask you to swap it.`)) {
                  deleteRecipe(initial!.id)
                  onClose()
                }
              }}
            >
              Delete
            </button>
          )}
          <span className="spacer" />
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </Sheet>
  )
}

const DEFAULT_PROTEIN: Record<string, number> = { protein: 20, veg: 1.5, aromatic: 0, pantry: 0 }

function IngredientForm({ onSave, onCancel }: { onSave: (i: Ingredient) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('veg')
  const [protein, setProtein] = useState(String(DEFAULT_PROTEIN.veg))
  const [useBy, setUseBy] = useState('4')
  const [freezable, setFreezable] = useState(false)
  const [leafy, setLeafy] = useState(false)
  const [storage, setStorage] = useState('')

  return (
    <div className="card stack" style={{ gap: 8 }}>
      <h3>New ingredient</h3>
      <label className="field">
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lamb shoulder" />
      </label>
      <div className="grid-2">
        <label className="field">
          Category
          <select
            value={category}
            onChange={(e) => {
              const c = e.target.value as Category
              setCategory(c)
              setProtein(String(DEFAULT_PROTEIN[c]))
              if (c === 'protein') {
                setFreezable(true)
                setUseBy('6')
              }
            }}
          >
            {FORM_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Protein per 100 g
          <input type="number" inputMode="decimal" min={0} step="0.1" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </label>
      </div>
      <label className="field">
        Cook by (counted from the Sunday shop{freezable ? ', after freezing' : ''})
        <select value={useBy} onChange={(e) => setUseBy(e.target.value)}>
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <option key={d} value={d}>
              {DAY_NAMES[d]} ({d + 1} days)
            </option>
          ))}
        </select>
      </label>
      {category === 'protein' && (
        <label className="check">
          <input type="checkbox" checked={freezable} onChange={(e) => setFreezable(e.target.checked)} />
          <span className="check-text small">Freeze on Sunday (thaw the night before)</span>
        </label>
      )}
      {category === 'veg' && (
        <label className="check">
          <input type="checkbox" checked={leafy} onChange={(e) => setLeafy(e.target.checked)} />
          <span className="check-text small">Leafy green</span>
        </label>
      )}
      <label className="field">
        Storage tip
        <input type="text" value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="How to keep it fresh" />
      </label>
      <div className="row">
        <span className="spacer" />
        <button className="btn small" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn small primary"
          disabled={!name.trim()}
          onClick={() =>
            onSave({
              id: newId('i', name),
              name: name.trim(),
              category,
              protein: Math.max(0, Number(protein) || 0),
              useBy: Number(useBy),
              freezable: category === 'protein' && freezable ? true : undefined,
              leafy: category === 'veg' && leafy ? true : undefined,
              storage: storage.trim(),
            })
          }
        >
          Save ingredient
        </button>
      </div>
    </div>
  )
}
