import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFridge } from '../context/FridgeContext'
import * as fridgeApi from '../api/fridge'
import * as ingredientApi from '../api/ingredient'
import ExpiryBadge from '../components/ExpiryBadge'
import CategoryIcon from '../components/CategoryIcon'
import NutritionTag from '../components/NutritionTag'
import FridgeItemModal from '../components/FridgeItemModal'
import { STORAGE_LOCATION_LABEL, getDday } from '../utils/expiry'
import EmptyFridgeState from '../components/EmptyFridgeState'
import './FridgeItemsPage.css'

const SORT_OPTIONS = [
  { value: 'expiry', label: '소비기한순' },
  { value: 'created', label: '등록순' },
  { value: 'updated', label: '수정순' },
]

export default function FridgeItemsPage() {
  const { selectedFridge, loading: fridgeLoading } = useFridge()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState('expiry')
  const [modal, setModal] = useState(null) // { mode: 'create' } | { mode: 'edit', item }
  const [error, setError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  const fridgeId = selectedFridge?.id

  const loadItems = useCallback(async () => {
    if (!fridgeId) {
      setItems([])
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await fridgeApi.getFridgeItems(fridgeId)
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fridgeId])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const sortedItems = useMemo(() => {
    const copy = [...items]
    if (sort === 'expiry') {
      copy.sort((a, b) => {
        const da = getDday(a.expiryDate)
        const db = getDday(b.expiryDate)
        if (da === null) return 1
        if (db === null) return -1
        return da - db
      })
    } else if (sort === 'created') {
      copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sort === 'updated') {
      copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
    return copy
  }, [items, sort])

  async function handleCreate(payload) {
    await fridgeApi.createFridgeItem(fridgeId, payload)
    await loadItems()
  }

  async function handleUpdate(itemId, payload) {
    await fridgeApi.updateFridgeItem(fridgeId, itemId, payload)
    await loadItems()
  }

  async function handleDelete(item) {
    if (!window.confirm(`'${item.ingredientName}'을(를) 삭제할까요?`)) return
    await fridgeApi.deleteFridgeItem(fridgeId, item.id)
    await loadItems()
  }

  async function handleSync() {
    setSyncing(true)
    setSyncMessage('')
    try {
      const result = await ingredientApi.syncRawMaterials()
      setSyncMessage(
        `동기화 완료: 총 ${result.totalFetched}건 중 신규 ${result.created}건, 갱신 ${result.updated}건` +
          (result.failed > 0 ? `, 실패 ${result.failed}건` : '')
      )
      await loadItems()
    } catch (err) {
      setSyncMessage(err.message)
    } finally {
      setSyncing(false)
    }
  }

  if (!fridgeLoading && !selectedFridge) {
    return <EmptyFridgeState />
  }

  return (
    <div className="fridge-items-page">
      <div className="fridge-items-header">
        <div>
          <h1>냉장고 재료</h1>
          <p>{selectedFridge ? `${selectedFridge.name} · 총 ${items.length}개` : ''}</p>
        </div>
        <div className="fridge-items-header-actions">
          <button type="button" className="btn btn-ghost" onClick={handleSync} disabled={syncing}>
            {syncing ? '영양정보 동기화 중...' : '영양정보 동기화'}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>
            + 재료 추가
          </button>
        </div>
      </div>

      <div className="fridge-items-toolbar">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`sort-chip${sort === opt.value ? ' sort-chip--active' : ''}`}
            onClick={() => setSort(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {syncMessage && <p className="fridge-items-sync-message">{syncMessage}</p>}
      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p className="fridge-items-empty">불러오는 중...</p>
      ) : sortedItems.length === 0 ? (
        <p className="fridge-items-empty">아직 등록된 재료가 없어요. 재료를 추가해보세요.</p>
      ) : (
        <ul className="fridge-item-list">
          {sortedItems.map((item) => (
            <li key={item.id} className="fridge-item-row">
              <CategoryIcon categoryName={item.categoryName} />
              <div className="fridge-item-main">
                <span className="fridge-item-name">{item.ingredientName}</span>
                <span className="fridge-item-meta">
                  {item.quantity}
                  {item.unit} · {STORAGE_LOCATION_LABEL[item.storageLocation]}
                  {item.memo ? ` · ${item.memo}` : ''}
                </span>
              </div>
              <NutritionTag item={item} />
              <ExpiryBadge expiryDate={item.expiryDate} />
              <div className="fridge-item-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal({ mode: 'edit', item })}>
                  수정
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(item)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal?.mode === 'create' && (
        <FridgeItemModal mode="create" onClose={() => setModal(null)} onSubmit={handleCreate} />
      )}
      {modal?.mode === 'edit' && (
        <FridgeItemModal
          mode="edit"
          initialItem={modal.item}
          onClose={() => setModal(null)}
          onSubmit={(payload) => handleUpdate(modal.item.id, payload)}
        />
      )}
    </div>
  )
}
