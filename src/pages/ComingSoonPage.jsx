import './ComingSoonPage.css'

export default function ComingSoonPage({ title, description, previewItems = [] }) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-card">
        <span className="coming-soon-tag">준비중</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <p className="coming-soon-note">
          이 화면은 디자인 미리보기이며, 아직 쿡지니 백엔드 API와 연결되어 있지 않아요.
        </p>
      </div>

      {previewItems.length > 0 && (
        <div className="coming-soon-preview">
          {previewItems.map((item) => (
            <div className="coming-soon-preview-item" key={item.title}>
              <div className="coming-soon-preview-icon">{item.emoji}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
