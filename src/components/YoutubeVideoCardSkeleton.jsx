import './RecipeCardSkeleton.css'
import './YoutubeVideoCardSkeleton.css'

export default function YoutubeVideoCardSkeleton() {
  return (
    <div className="youtube-video-card-skeleton" aria-hidden="true">
      <span className="skeleton-block skeleton-thumb" />
      <span className="skeleton-block skeleton-video-title" />
      <span className="skeleton-block skeleton-video-title skeleton-video-title--short" />
      <span className="skeleton-block skeleton-video-channel" />
      <span className="skeleton-block skeleton-video-button" />
    </div>
  )
}
