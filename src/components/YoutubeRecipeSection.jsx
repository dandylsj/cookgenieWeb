import YoutubeVideoCard from './YoutubeVideoCard'
import YoutubeVideoCardSkeleton from './YoutubeVideoCardSkeleton'
import './YoutubeRecipeSection.css'

export default function YoutubeRecipeSection({ title, videos, loading, error, importingId, onImport }) {
  return (
    <div className="youtube-section">
      <h2 className="youtube-section-title">{title}</h2>
      {loading ? (
        <div className="youtube-section-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <YoutubeVideoCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="form-hint">{error}</p>
      ) : videos.length === 0 ? (
        <p className="form-hint">검색 결과가 없어요.</p>
      ) : (
        <div className="youtube-section-row">
          {videos.map((video) => (
            <YoutubeVideoCard
              key={video.videoId}
              video={video}
              importing={importingId === video.videoId}
              onImport={onImport}
            />
          ))}
        </div>
      )}
    </div>
  )
}
