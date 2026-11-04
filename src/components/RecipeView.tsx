import { DAY_NAMES, KIND_LABELS, dishName, formatItem, freshIds, renderStep, type Catalog, type CatalogRecipe, type DishView } from '../lib/planner.ts'

/** Ingredients, steps and portion guide for one recipe. With `dish`, amounts are this week's scaled batch. */
export function RecipeView({ recipe, dish, catalog }: { recipe: CatalogRecipe; dish?: DishView; catalog: Catalog }) {
  const items = dish ? dish.items : Object.entries(recipe.items).map(([id, g]) => ({ id, g }))
  const fresh = freshIds(recipe, catalog)
  const sharing = catalog.recipes
    .filter((r) => r.id !== recipe.id && !r.hidden && freshIds(r, catalog).some((id) => fresh.includes(id)))
    .map(dishName)
  const amounts = Object.fromEntries(items.map((it) => [it.id, it.g]))

  return (
    <div className="stack">
      {recipe.zh && <p className="muted small" style={{ margin: 0 }}>{recipe.name}</p>}
      <div className="row wrap">
        <span className="badge accent">{KIND_LABELS[recipe.kind]}</span>
        <span className="badge">{recipe.cuisine}</span>
        <span className="badge">⏱ {recipe.minutes} min</span>
        {recipe.favourite && <span className="badge">⭐ Favourite</span>}
        {recipe.custom && <span className="badge">My recipe</span>}
        {recipe.cookAhead && <span className="badge">🍲 Cook ahead</span>}
      </div>

      <div className="card flat">
        <div className="card-head">
          <h3>Ingredients</h3>
          <span className="spacer" />
          <span className="muted small">
            {dish
              ? dish.batch === 2
                ? `${DAY_NAMES[dish.day]}: dinner + 2 lunch boxes`
                : `${DAY_NAMES[dish.day]}: one meal for 2`
              : 'One meal for 2'}
          </span>
        </div>
        <ul className="list">
          {items.map((it) => {
            const ing = catalog.ingredients[it.id]
            return (
              <li key={it.id} className="row">
                <span>{ing?.name ?? it.id}</span>
                <span className="spacer" />
                <span className="amount">{formatItem(it.id, it.g, ing)}</span>
              </li>
            )
          })}
        </ul>
        {dish && (
          <p className="small muted" style={{ marginBottom: 0 }}>
            Each plate: <span className="her">her ≈ {dish.portion[0]} g</span> · <span className="him">him ≈ {dish.portion[1]} g</span> (cooked)
            {dish.batch === 2 && '. Pack the other half into tomorrow’s lunch boxes.'}
          </p>
        )}
      </div>

      {recipe.steps.length > 0 && (
        <div className="card flat">
          <h3 style={{ marginBottom: 6 }}>Steps</h3>
          <ol className="steps">
            {recipe.steps.map((s, i) => (
              <li key={i}>{renderStep(s, amounts, catalog)}</li>
            ))}
          </ol>
          {recipe.source && (
            <p className="tiny muted" style={{ marginBottom: 0 }}>
              From{' '}
              <a href={recipe.source} target="_blank" rel="noreferrer">
                {recipe.source.includes('CookLikeHOC') ? 'CookLikeHOC 像老乡鸡那样做饭' : 'HowToCook 程序员做饭指南'} ↗
              </a>
              {dish && dish.batch === 2 && '. Amounts in the steps are for this double batch.'}
            </p>
          )}
        </div>
      )}

      {sharing.length > 0 && (
        <p className="small muted">
          <b>Shares ingredients with:</b> {sharing.slice(0, 12).join(', ')}
          {sharing.length > 12 && ` and ${sharing.length - 12} more`}
        </p>
      )}
    </div>
  )
}
