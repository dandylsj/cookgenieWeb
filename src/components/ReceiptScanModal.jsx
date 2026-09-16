import { useRef, useState } from 'react'
import * as receiptApi from '../api/receipt'
import * as ingredientApi from '../api/ingredient'
import * as fridgeApi from '../api/fridge'
import Modal from './Modal'
import CategoryIcon from './CategoryIcon'
import '../styles/forms.css'
import './ReceiptScanModal.css'

function today() {
  return new Date().toISOString().slice(0, 10)
}

/** ReceiptItemResponse -> 리뷰 화면에서 다루는 편집 가능한 form 상태로 변환. */
function toDraft(item, index) {
  return {
    key: index,
    checked: true,
    name: item.name,
    quantity: item.quantityValue ?? 1,
    unit: item.unit || '개',
    categoryName: item.categoryNameGuess || '기타',
    matchedIngredientId: item.matchedIngredientId ?? null,
  }
}

/**
 * 영수증 사진 -> Claude 비전 분석 -> 인식된 식재료 후보를 사용자가 확인/수정 -> 선택한 것만 한 번에 냉장고에 등록.
 * 백엔드 scan API는 미리보기만 하므로, 등록은 기존 재료 등록(POST /ingredients) + 냉장고 재료 추가(POST .../items) API를 그대로 재사용한다.
 */
export default function ReceiptScanModal({ fridgeId, onClose, onComplete }) {
  const [step, setStep] = useState('select') // 'select' | 'scanning' | 'review'
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  function handleFileChange(event) {
    const selected = event.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setError('')
  }

  async function handleScan() {
    if (!file) return
    setStep('scanning')
    setError('')
    try {
      const result = await receiptApi.scanReceipt(fridgeId, file)
      if (!result.items || result.items.length === 0) {
        setError('영수증에서 식재료를 찾지 못했어요. 다른 사진으로 시도해보세요.')
        setStep('select')
        return
      }
      setItems(result.items.map(toDraft))
      setStep('review')
    } catch (err) {
      setError(err.message)
      setStep('select')
    }
  }

  function updateItem(key, patch) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)))
  }

  async function handleConfirm() {
    const selected = items.filter((it) => it.checked && it.name.trim())
    if (selected.length === 0) {
      setError('담을 재료를 하나 이상 선택해주세요.')
      return
    }
    setSaving(true)
    setError('')
    const failed = []
    for (const it of selected) {
      try {
        let ingredientId = it.matchedIngredientId
        if (!ingredientId) {
          const ingredient = await ingredientApi.createIngredient({
            name: it.name.trim(),
            categoryName: it.categoryName,
            defaultUnit: it.unit,
          })
          ingredientId = ingredient.id
        }
        await fridgeApi.createFridgeItem(fridgeId, {
          ingredientId,
          quantity: Number(it.quantity) || 1,
          unit: it.unit || '개',
          storageLocation: 'REFRIGERATED',
          purchasedAt: today(),
          expiryDate: null,
          memo: null,
        })
      } catch (err) {
        failed.push(`${it.name}: ${err.message}`)
      }
    }
    setSaving(false)

    if (failed.length > 0) {
      setError(`일부 재료는 담지 못했어요 - ${failed.join(', ')}`)
    }
    if (failed.length < selected.length) {
      await onComplete()
    }
    if (failed.length === 0) {
      onClose()
    }
  }

  if (step === 'review') {
    const checkedCount = items.filter((it) => it.checked).length
    return (
      <Modal
        title="영수증 인식 결과"
        onClose={saving ? undefined : onClose}
        width={560}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              취소
            </button>
            <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={saving || checkedCount === 0}>
              {saving ? '담는 중...' : `선택한 ${checkedCount}개 냉장고에 담기`}
            </button>
          </>
        }
      >
        <p className="form-hint">
          영수증 품목명이 축약되어 있을 수 있어요. 이름/수량/카테고리를 확인하고 필요하면 고쳐주세요.
        </p>
        {error && <div className="form-error">{error}</div>}
        <ul className="receipt-review-list">
          {items.map((it) => (
            <li key={it.key} className="receipt-review-row">
              <input
                type="checkbox"
                checked={it.checked}
                onChange={(e) => updateItem(it.key, { checked: e.target.checked })}
              />
              <CategoryIcon categoryName={it.categoryName} size={32} />
              <input
                className="input receipt-review-name"
                value={it.name}
                onChange={(e) => updateItem(it.key, { name: e.target.value })}
              />
              <input
                type="number"
                min="0"
                step="0.1"
                className="input receipt-review-qty"
                value={it.quantity}
                onChange={(e) => updateItem(it.key, { quantity: e.target.value })}
              />
              <input
                className="input receipt-review-unit"
                value={it.unit}
                onChange={(e) => updateItem(it.key, { unit: e.target.value })}
              />
            </li>
          ))}
        </ul>
      </Modal>
    )
  }

  return (
    <Modal title="영수증으로 재료 담기" onClose={onClose} width={480}>
      <p className="form-hint">영수증 사진을 올리면 AI가 식재료로 보이는 품목을 찾아드려요.</p>
      {error && <div className="form-error">{error}</div>}

      {step === 'scanning' ? (
        <p className="receipt-scanning-hint">AI가 영수증을 분석하고 있어요. 잠시만 기다려주세요...</p>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="receipt-file-input"
            onChange={handleFileChange}
          />
          {preview ? (
            <div className="receipt-preview" onClick={() => fileInputRef.current?.click()}>
              <img src={preview} alt="영수증 미리보기" />
              <span className="receipt-preview-hint">다른 사진 선택하기</span>
            </div>
          ) : (
            <button type="button" className="receipt-upload-box" onClick={() => fileInputRef.current?.click()}>
              <span className="receipt-upload-icon">🧾</span>
              <span>영수증 사진 선택하기</span>
            </button>
          )}
          <button type="button" className="btn btn-primary btn-block receipt-scan-btn" onClick={handleScan} disabled={!file}>
            분석하기
          </button>
        </>
      )}
    </Modal>
  )
}
