import { useRef, useState } from 'react'
import * as receiptApi from '../api/receipt'
import * as productApi from '../api/product'
import * as ingredientApi from '../api/ingredient'
import * as fridgeApi from '../api/fridge'
import Modal from './Modal'
import CategoryIcon from './CategoryIcon'
import '../styles/forms.css'
import './ReceiptScanModal.css'

/** 세 사진 인식 모드(영수증/주문내역/실물 상품)의 화면 문구·API만 다르고 나머지 흐름은 완전히 동일하다. */
const MODE_CONFIG = {
  receipt: {
    scanFn: receiptApi.scanReceipt,
    uploadTitle: '영수증으로 재료 담기',
    uploadHint: '영수증 사진을 올리면 AI가 식재료로 보이는 품목을 찾아드려요.',
    uploadIcon: '🧾',
    uploadLabel: '영수증 사진 선택하기',
    scanningHint: 'AI가 영수증을 분석하고 있어요. 잠시만 기다려주세요...',
    reviewTitle: '영수증 인식 결과',
    noItemsError: '영수증에서 식재료를 찾지 못했어요. 다른 사진으로 시도해보세요.',
  },
  orderHistory: {
    scanFn: receiptApi.scanOrderHistory,
    uploadTitle: '주문내역으로 재료 담기',
    uploadHint: '쿠팡·마켓컬리·네이버쇼핑 주문내역 화면을 캡처해서 올리면 AI가 식재료로 보이는 품목을 찾아드려요.',
    uploadIcon: '🛍️',
    uploadLabel: '주문내역 캡처 선택하기',
    scanningHint: 'AI가 주문내역을 분석하고 있어요. 잠시만 기다려주세요...',
    reviewTitle: '주문내역 인식 결과',
    noItemsError: '주문내역에서 식재료를 찾지 못했어요. 다른 캡처로 시도해보세요.',
  },
  product: {
    scanFn: productApi.scanProduct,
    uploadTitle: '실물 사진으로 재료 담기',
    uploadHint: '포장·라벨이 잘 보이게 사진을 찍어 올리면 AI가 상품명을 읽어드려요.',
    uploadIcon: '🍎',
    uploadLabel: '상품 사진 선택하기',
    scanningHint: 'AI가 사진을 분석하고 있어요. 잠시만 기다려주세요...',
    reviewTitle: '상품 인식 결과',
    noItemsError: '사진에서 상품을 찾지 못했어요. 다른 사진으로 시도해보세요.',
  },
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * ReceiptItemResponse -> 리뷰 화면에서 다루는 편집 가능한 form 상태로 변환.
 * matchedProcessedFood/matchedDish 중 하나라도 있으면 식약처 공식 데이터와 이름이 일치한 것 - 등록 시
 * AI 추정 없이 그 영양정보를 그대로 써서 바로 정확하게 채워 넣는다.
 */
function toDraft(item, index) {
  const matchedOfficial = item.matchedProcessedFood || item.matchedDish || null
  return {
    key: index,
    checked: true,
    name: item.name,
    quantity: item.quantityValue ?? 1,
    unit: item.unit || matchedOfficial?.referenceUnit || '개',
    categoryName: item.categoryNameGuess || '기타',
    matchedIngredientId: item.matchedIngredientId ?? null,
    matchedOfficial,
  }
}

/**
 * 사진(영수증/주문내역/실물 상품) -> Claude 비전 분석 -> 인식된 식재료 후보를 사용자가 확인/수정 ->
 * 선택한 것만 한 번에 냉장고에 등록. 백엔드 scan API는 미리보기만 하므로, 등록은 기존 재료 등록
 * (POST /ingredients) + 냉장고 재료 추가(POST .../items) API를 그대로 재사용한다.
 */
export default function ReceiptScanModal({ mode = 'receipt', fridgeId, onClose, onComplete }) {
  const config = MODE_CONFIG[mode]
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
      const result = await config.scanFn(fridgeId, file)
      if (!result.items || result.items.length === 0) {
        setError(config.noItemsError)
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
          const payload = { name: it.name.trim(), categoryName: it.categoryName, defaultUnit: it.unit }
          // 식약처 공식 데이터와 이름이 일치했으면 AI 추정 호출 없이 그 영양정보를 그대로 직접 입력값으로 써서
          // 정확하게 채워 넣는다. 매칭이 없으면 Claude에게 이름만으로 영양정보 추정을 요청한다 - 사진 인식은
          // 사용자가 몇 개만 골라서 등록하는 흐름이라(전체 목록을 미리 추정하는 것과 다름) 이 정도 호출은
          // 감당할 만하고, 그래야 "영양정보가 없다"고 비어 보이는 채로 등록되는 걸 막을 수 있다.
          if (it.matchedOfficial) {
            payload.calories = it.matchedOfficial.calories
            payload.carbohydrateG = it.matchedOfficial.carbohydrateG
            payload.proteinG = it.matchedOfficial.proteinG
            payload.fatG = it.matchedOfficial.fatG
            payload.referenceUnit = it.matchedOfficial.referenceUnit
          } else {
            payload.autoEstimateNutrition = true
          }
          const ingredient = await ingredientApi.createIngredient(payload)
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
        title={config.reviewTitle}
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
          이름/수량/카테고리를 확인하고 필요하면 고쳐주세요.
          <br />
          🏛️ 표시가 있으면 식약처 공식 데이터와 일치해서 영양정보까지 정확하게 채워져요. 표시가 없는 항목은
          담을 때 Claude가 이름만으로 영양정보를 추정해요 - 이름이 정확할수록 추정도 정확해지니 필요하면
          고쳐주세요.
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
              {it.matchedOfficial && (
                <span className="receipt-official-badge" title="식약처 공식 데이터와 일치">
                  🏛️
                </span>
              )}
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
    <Modal title={config.uploadTitle} onClose={onClose} width={480}>
      <p className="form-hint">{config.uploadHint}</p>
      {error && <div className="form-error">{error}</div>}

      {step === 'scanning' ? (
        <p className="receipt-scanning-hint">{config.scanningHint}</p>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="receipt-file-input"
            onChange={handleFileChange}
          />
          {preview ? (
            <div className="receipt-preview" onClick={() => fileInputRef.current?.click()}>
              <img src={preview} alt="사진 미리보기" />
              <span className="receipt-preview-hint">다른 사진 선택하기</span>
            </div>
          ) : (
            <button type="button" className="receipt-upload-box" onClick={() => fileInputRef.current?.click()}>
              <span className="receipt-upload-icon">{config.uploadIcon}</span>
              <span>{config.uploadLabel}</span>
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
