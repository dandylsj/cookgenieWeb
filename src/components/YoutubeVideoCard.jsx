import Button from './Button'
import './YoutubeVideoCard.css'

export default function YoutubeVideoCard({ video, importing, onImport }) {
  return (
    <div className="youtube-video-card">
      <img src={video.thumbnailUrl} alt="" className="youtube-video-thumb" loading="lazy" />
      <p className="youtube-video-title">{video.title}</p>
      <p className="youtube-video-channel">{video.channelTitle}</p>
      <Button
        className="youtube-video-import"
        onClick={() => onImport(video)}
        disabled={importing}
      >
        {importing ? '가져오는 중...' : '레시피로 가져오기'}
      </Button>
    </div>
  )
}
