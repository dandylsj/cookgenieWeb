import './RecipeCardSkeleton.css'
import './IngredientStatsSkeleton.css'

export default function IngredientStatsSkeleton() {
  return (
    <div className="ingredient-stats" aria-hidden="true">
      <div className="stats-tile-row">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="stat-tile">
            <span className="skeleton-block skeleton-tile-label" />
            <span className="skeleton-block skeleton-tile-value" />
          </div>
        ))}
      </div>

      <div className="stats-card">
        <span className="skeleton-block skeleton-card-title" />
        <span className="skeleton-block skeleton-heatmap" />
      </div>

      <div className="stats-list-row">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="stats-card stats-list-card">
            <span className="skeleton-block skeleton-card-title" />
            <ul className="stats-item-list">
              {Array.from({ length: 5 }).map((_, j) => (
                <li key={j}>
                  <span className="skeleton-block skeleton-stats-icon" />
                  <span className="skeleton-block skeleton-stats-name" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="stats-list-row">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="stats-card stats-list-card">
            <span className="skeleton-block skeleton-card-title" />
            <div className="skeleton-bars">
              {Array.from({ length: 4 }).map((_, j) => (
                <span key={j} className="skeleton-block skeleton-bar" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
