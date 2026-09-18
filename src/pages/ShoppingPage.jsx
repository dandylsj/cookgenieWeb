import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFridge } from '../context/FridgeContext'
import * as shoppingApi from '../api/shopping'
import Modal from '../components/Modal'
import ShoppingItemPicker from '../components/ShoppingItemPicker'
import CoupangPriceModal from '../components/CoupangPriceModal'
import EmptyFridgeState from '../components/EmptyFridgeState'
import { formatRelativeTime } from '../utils/time'
import './ShoppingPage.css'

export default function ShoppingPage() {
  const { selectedFridge, loading: fridgeLoading } = useFridge()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [priceCheckItem, setPriceCheckItem] = useState(null)

  const fridgeId = selectedFridge?.id
  // 냉장고를 빠르게 전환했을 때 이전 냉장고의 응답이 늦게 도착해서 지금 선택된 냉장고의 목록을
  // 덮어써버리는 걸 막기 위해, 응답이 왔을 때도 여전히 같은 냉장고인지 확인한다.
  const fridgeIdRef = useRef(fridgeId)
  useEffect(() => {
    fridgeIdRef.current = fridgeId
  }, [fridgeId])

  const loadItems = useCallback(async () => {
    const requestedFridgeId = fridgeId
    if (!requestedFridgeId) {
      setItems([])
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await shoppingApi.getShoppingItems(requestedFridgeId)
      if (fridgeIdRef.current !== requestedFridgeId) return
      setItems(data)
    } catch (err) {
      if (fridgeIdRef.current === requestedFridgeId) setError(err.message)
    } finally {
      if (fridgeIdRef.current === requestedFridgeId) setLoading(false)
    }
  }, [fridgeId])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const doneCount = useMemo(() => items.filter((i) => i.checked).length, [items])

  async function handleToggleChecked(item) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)))
    try {
      await shoppingApi.updateShoppingItemChecked(fridgeId, item.id, !item.checked)
    } catch (err) {
      setError(err.message)
      loadItems()
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`'${item.name}'을(를) 목록에서 삭제할까요?`)) return
    try {
      await shoppingApi.deleteShoppingItem(fridgeId, item.id)
      await loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handlePickName(name) {
    await shoppingApi.addShoppingItem(fridgeId, name)
    await loadItems()
  }

  if (!fridgeLoading && !selectedFridge) {
    return <EmptyFridgeState />
  }

  return (
    <div className="shopping-page">
      <div className="shopping-header">
        <div>
          <h1>장보기</h1>
          <p>{selectedFridge ? selectedFridge.name : ''}</p>
        </div>
        <div className="shopping-header-count">
          <span className="shopping-count-total">{items.length}개</span>
          <span className="shopping-count-done">완료 {doneCount}개</span>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p className="shopping-empty">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="shopping-empty">아직 담아둔 재료가 없어요. 재료를 추가해보세요.</p>
      ) : (
        <ul className="shopping-list">
          {items.map((item) => (
            <li key={item.id} className={`shopping-row${item.checked ? ' shopping-row--checked' : ''}`}>
              <button
                type="button"
                className="shopping-checkbox"
                aria-label={item.checked ? '완료 해제' : '완료 처리'}
                onClick={() => handleToggleChecked(item)}
              >
                {item.checked && '✓'}
              </button>
              <div className="shopping-row-main">
                <span className="shopping-row-name">{item.name}</span>
                <span className="shopping-row-time">{formatRelativeTime(item.createdAt)}</span>
              </div>
              <button type="button" className="btn btn-ghost shopping-price-btn" onClick={() => setPriceCheckItem(item)}>
                최저가 확인
              </button>
              <button
                type="button"
                className="shopping-delete-btn"
                aria-label="삭제"
                onClick={() => handleDelete(item)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="shopping-fab" disabled={!fridgeId} onClick={() => setShowPicker(true)}>
        + 재료 추가
      </button>

      {showPicker && (
        <Modal title="장보기 재료 추가" onClose={() => setShowPicker(false)}>
          <ShoppingItemPicker
            onSelect={async (name) => {
              await handlePickName(name)
              setShowPicker(false)
            }}
          />
        </Modal>
      )}

      {priceCheckItem && (
        <CoupangPriceModal keyword={priceCheckItem.name} onClose={() => setPriceCheckItem(null)} />
      )}
    </div>
  )
}
