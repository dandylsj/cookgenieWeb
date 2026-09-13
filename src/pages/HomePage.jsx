import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFridge } from '../context/FridgeContext'
import * as fridgeApi from '../api/fridge'
import ExpiryBadge from '../components/ExpiryBadge'
import EmptyFridgeState from '../components/EmptyFridgeState'
import { getDday } from '../utils/expiry'
import './HomePage.css'

const URGENT_WITHIN_DAYS = 7

export default function HomePage() {
  const { user } = useAuth()
  const { selectedFridge, loading: fridgeLoading } = useFridge()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedFridge) {
      setItems([])
      return
    }
    setLoading(true)
    fridgeApi
      .getFridgeItems(selectedFridge.id)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [selectedFridge])

  if (!fridgeLoading && !selectedFridge) {
    return <EmptyFridgeState />
  }

  const urgentItems = items
    .filter((item) => {
      const dday = getDday(item.expiryDate)
      return dday !== null && dday <= URGENT_WITHIN_DAYS
    })
    .sort((a, b) => getDday(a.expiryDate) - getDday(b.expiryDate))

  return (
    <div className="home-page">
      <h1 className="home-greeting">{user?.nickname}님, 오늘도 알뜰하게 관리해봐요</h1>

      <div className="home-summary-card">
        <div>
          <p className="home-summary-label">주의할 재료</p>
          <p className="home-summary-count">
            {loading ? '-' : urgentItems.length}
            <span>개</span>
          </p>
          <p className="home-summary-desc">
            {urgentItems.length === 0
              ? '소비기한이 임박한 재료가 없어요. 냉장고가 잘 관리되고 있어요!'
              : `${URGENT_WITHIN_DAYS}일 이내에 소비기한이 다가오는 재료예요.`}
          </p>
        </div>
        <Link to="/fridge" className="btn btn-primary">
          재료 전체 보기
        </Link>
      </div>

      {urgentItems.length > 0 && (
        <ul className="home-urgent-list">
          {urgentItems.slice(0, 6).map((item) => (
            <li key={item.id} className="home-urgent-item">
              <span className="home-urgent-name">{item.ingredientName}</span>
              <span className="home-urgent-qty">
                {item.quantity}
                {item.unit}
              </span>
              <ExpiryBadge expiryDate={item.expiryDate} />
            </li>
          ))}
        </ul>
      )}

      <div className="home-stats-row">
        <div className="home-stat-card">
          <p className="home-stat-label">전체 재료</p>
          <p className="home-stat-value">{items.length}개</p>
        </div>
        <div className="home-stat-card">
          <p className="home-stat-label">냉장</p>
          <p className="home-stat-value">{items.filter((i) => i.storageLocation === 'REFRIGERATED').length}개</p>
        </div>
        <div className="home-stat-card">
          <p className="home-stat-label">냉동</p>
          <p className="home-stat-value">{items.filter((i) => i.storageLocation === 'FROZEN').length}개</p>
        </div>
        <div className="home-stat-card">
          <p className="home-stat-label">실온</p>
          <p className="home-stat-value">{items.filter((i) => i.storageLocation === 'ROOM_TEMP').length}개</p>
        </div>
      </div>
    </div>
  )
}
