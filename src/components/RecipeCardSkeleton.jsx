import './RecipeCardSkeleton.css'

export default function RecipeCardSkeleton() {
  return (
    <div className="recipe-card-skeleton" aria-hidden="true">
      <div className="recipe-card-top">
        <span className="skeleton-block skeleton-type" />
      </div>
      <span className="skeleton-block skeleton-title" />
      <span className="skeleton-block skeleton-meta" />
      <span className="skeleton-block skeleton-match" />
    </div>
  )
}
