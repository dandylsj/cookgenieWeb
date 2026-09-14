import YoutubeVideoCard from './YoutubeVideoCard'
import './YoutubeRecipeSection.css'

export default function YoutubeRecipeSection({ title, videos, loading, error, importingId, onImport }) {
  return (
    <div className="youtube-section">
      <h2 className="youtube-section-title">{title}</h2>
      {loading ? (
        <p className="form-hint">불러오는 중...</p>
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
