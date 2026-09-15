import { assignCategoricalColors } from '../utils/palette'
import './DistributionBar.css'

export default function DistributionBar({ title, entries }) {
  const total = entries.reduce((sum, e) => sum + e.count, 0)
  const colored = assignCategoricalColors(entries)

  return (
    <div className="distribution-card">
      <h3 className="distribution-title">{title}</h3>
      {total === 0 ? (
        <p className="form-hint">데이터가 없어요.</p>
      ) : (
        <>
          <div className="distribution-bar">
            {colored.map((entry) => (
              <span
                key={entry.label}
                className="distribution-segment"
                style={{ width: `${(entry.count / total) * 100}%`, background: entry.color }}
                title={`${entry.label} ${entry.count}개`}
              />
            ))}
          </div>
          <ul className="distribution-legend">
            {colored.map((entry) => (
              <li key={entry.label}>
                <span className="distribution-swatch" style={{ background: entry.color }} />
                <span className="distribution-label">{entry.label}</span>
                <span className="distribution-count">{entry.count}개</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
