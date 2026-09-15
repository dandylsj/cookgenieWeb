import { useMemo } from 'react'
import CategoryIcon from './CategoryIcon'
import ExpiryBadge from './ExpiryBadge'
import ActivityHeatmap from './ActivityHeatmap'
import DistributionBar from './DistributionBar'
import { getDday, STORAGE_LOCATION_LABEL } from '../utils/expiry'
import { formatRelativeTime } from '../utils/time'
import './IngredientStatsView.css'

export default function IngredientStatsView({ items }) {
  const stats = useMemo(() => {
    let imminent = 0
    let expired = 0
    items.forEach((item) => {
      const dday = getDday(item.expiryDate)
      if (dday === null) return
      if (dday < 0) expired++
      else if (dday <= 7) imminent++
    })
    return { total: items.length, imminent, expired }
  }, [items])

  const expirySorted = useMemo(
    () =>
      items
        .filter((item) => item.expiryDate != null)
        .sort((a, b) => getDday(a.expiryDate) - getDday(b.expiryDate))
        .slice(0, 5),
    [items]
  )

  const neglected = useMemo(
    () => [...items].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)).slice(0, 5),
    [items]
  )

  const categoryEntries = useMemo(() => {
    const map = new Map()
    items.forEach((item) => {
      const label = item.categoryName || '미분류'
      map.set(label, (map.get(label) || 0) + 1)
    })
    return Array.from(map, ([label, count]) => ({ label, count }))
  }, [items])

  const storageEntries = useMemo(() => {
    const map = new Map()
    items.forEach((item) => {
      const label = STORAGE_LOCATION_LABEL[item.storageLocation] || item.storageLocation
      map.set(label, (map.get(label) || 0) + 1)
    })
    return Array.from(map, ([label, count]) => ({ label, count }))
  }, [items])

  if (items.length === 0) {
    return <p className="fridge-items-empty">등록된 재료가 없어서 현황을 볼 수 없어요.</p>
  }

  return (
    <div className="ingredient-stats">
      <div className="stats-tile-row">
        <div className="stat-tile">
          <p className="stat-tile-label">총 재료</p>
          <p className="stat-tile-value">{stats.total}</p>
        </div>
        <div className="stat-tile stat-tile--warning">
          <p className="stat-tile-label">임박</p>
          <p className="stat-tile-value">{stats.imminent}</p>
        </div>
        <div className="stat-tile stat-tile--danger">
          <p className="stat-tile-label">지남</p>
          <p className="stat-tile-value">{stats.expired}</p>
        </div>
      </div>

      <div className="stats-card">
        <h3 className="stats-card-title">활동</h3>
        <ActivityHeatmap items={items} />
      </div>

      <div className="stats-list-row">
        <div className="stats-card stats-list-card">
          <h3 className="stats-card-title">소비기한 임박 재료</h3>
          {expirySorted.length === 0 ? (
            <p className="form-hint">소비기한이 등록된 재료가 없어요.</p>
          ) : (
            <ul className="stats-item-list">
              {expirySorted.map((item) => (
                <li key={item.id}>
                  <CategoryIcon categoryName={item.categoryName} size={32} />
                  <span className="stats-item-name">{item.ingredientName}</span>
                  <ExpiryBadge expiryDate={item.expiryDate} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="stats-card stats-list-card">
          <h3 className="stats-card-title">오래 방치된 재료</h3>
          <ul className="stats-item-list">
            {neglected.map((item) => (
              <li key={item.id}>
                <CategoryIcon categoryName={item.categoryName} size={32} />
                <span className="stats-item-name">{item.ingredientName}</span>
                <span className="stats-item-time">{formatRelativeTime(item.updatedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="stats-list-row">
        <DistributionBar title="카테고리 분포" entries={categoryEntries} />
        <DistributionBar title="보관 위치 분포" entries={storageEntries} />
      </div>
    </div>
  )
}
