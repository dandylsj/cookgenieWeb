import './RecipeCardSkeleton.css'
import './FridgeItemRowSkeleton.css'

export default function FridgeItemRowSkeleton() {
  return (
    <div className="fridge-item-row-skeleton" aria-hidden="true">
      <span className="skeleton-block skeleton-item-icon" />
      <div className="fridge-item-row-skeleton-main">
        <span className="skeleton-block skeleton-item-name" />
        <span className="skeleton-block skeleton-item-meta" />
      </div>
      <span className="skeleton-block skeleton-item-badge" />
    </div>
  )
}
