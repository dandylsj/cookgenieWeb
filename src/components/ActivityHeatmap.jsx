import { activityLevel, buildActivityCalendar } from '../utils/time'
import './ActivityHeatmap.css'

export default function ActivityHeatmap({ items, weeksBack = 18 }) {
  const { weeks, monthLabels } = buildActivityCalendar(items, weeksBack)

  return (
    <div className="activity-heatmap">
      <div className="activity-heatmap-scroll">
        <div className="activity-heatmap-months" style={{ gridTemplateColumns: `repeat(${weeks.length}, 14px)` }}>
          {monthLabels.map((m) => (
            <span key={m.weekIndex} style={{ gridColumnStart: m.weekIndex + 1 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="activity-heatmap-grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 14px)` }}>
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              const level = activityLevel(day.count)
              const gridPosition = { gridColumn: wi + 1, gridRow: di + 1 }
              if (level === -1) {
                return (
                  <span
                    key={`${wi}-${di}`}
                    className="activity-cell activity-cell--future"
                    style={gridPosition}
                  />
                )
              }
              return (
                <span
                  key={`${wi}-${di}`}
                  className={`activity-cell activity-cell--level-${level}`}
                  title={`${day.key} · 등록 ${day.count}개`}
                  style={gridPosition}
                />
              )
            })
          )}
        </div>
      </div>
      <div className="activity-heatmap-legend">
        <span>적음</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className={`activity-cell activity-cell--level-${level}`} />
        ))}
        <span>많음</span>
      </div>
    </div>
  )
}
