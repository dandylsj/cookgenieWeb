import { useCallback, useEffect, useState } from 'react'
import * as ingredientApi from '../api/ingredient'
import CategoryIcon from './CategoryIcon'
import ReferenceNutritionTag from './ReferenceNutritionTag'
import ReceiptScanModal from './ReceiptScanModal'
import { addRecentIngredient, getRecentIngredients } from '../utils/recentIngredients'
import '../styles/forms.css'
import './IngredientPicker.css'

const EMPTY_FORM = { name: '', categoryName: '', defaultUnit: '' }

/**
 * 식재료 검색 + 등록/수정/삭제까지 처리하고, 선택이 끝나면 onSelect(ingredient)를 호출한다.
 * 새 식재료 등록은 카테고리 그리드 -> 추천 재료 그리드 2단계로 진행되고, 목록에 없으면 직접 입력할 수 있다.
 * fridgeId/onReceiptDone을 주면 영수증 인식으로 여러 재료를 한 번에 담는 기능도 제공한다.
 */
export default function IngredientPicker({ onSelect, fridgeId, onReceiptDone }) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [formMode, setFormMode] = useState(null) // null | 'create' | 'edit'
  const [createStep, setCreateStep] = useState('category') // 'category' | 'pick'
  const [manualEntry, setManualEntry] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [showReceiptScan, setShowReceiptScan] = useState(false)
  const [recentIngredients] = useState(getRecentIngredients)

  function selectIngredient(ingredient) {
    addRecentIngredient(ingredient)
    onSelect(ingredient)
  }

  function handleDummyRecognition(label) {
    window.alert(`${label} 기능은 아직 준비 중이에요. 조금만 기다려주세요!`)
  }

  useEffect(() => {
    ingredientApi.getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (formMode !== 'create' || createStep !== 'pick') return
    const category = categories.find((c) => c.name === form.categoryName)
    if (!category) {
      setSuggestions([])
      return
    }
    setSuggestionsLoading(true)
    ingredientApi
      .getIngredientSuggestions(category.id)
      .then((list) => setSuggestions(list.map((s) => s.name)))
      .catch(() => setSuggestions([]))
      .finally(() => setSuggestionsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMode, createStep, form.categoryName, categories])

  const runSearch = useCallback(() => {
    setLoading(true)
    ingredientApi
      .searchIngredients(keyword)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [keyword])

  useEffect(() => {
    const timer = setTimeout(runSearch, 250)
    return () => clearTimeout(timer)
  }, [runSearch])

  function openCreateForm() {
    setForm({ ...EMPTY_FORM, name: keyword })
    setFormMode('create')
    setCreateStep('category')
    setManualEntry(false)
    setEditingId(null)
    setError('')
  }

  function openEditForm(ingredient) {
    setForm({
      name: ingredient.name,
      categoryName: ingredient.categoryName ?? categories[0]?.name ?? '',
      defaultUnit: ingredient.defaultUnit ?? '',
    })
    setFormMode('edit')
    setEditingId(ingredient.id)
    setError('')
  }

  function closeForm() {
    setFormMode(null)
    setEditingId(null)
    setError('')
  }

  function selectCategory(categoryName) {
    setForm((prev) => ({ ...prev, categoryName }))
    setCreateStep('pick')
    setManualEntry(false)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (formMode === 'edit') {
        await ingredientApi.updateIngredient(editingId, form)
        closeForm()
        runSearch()
      } else {
        const ingredient = await ingredientApi.createIngredient(form)
        selectIngredient(ingredient)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSuggestionClick(name) {
    setError('')
    setSubmitting(true)
    try {
      const ingredient = await ingredientApi.createIngredient({ ...form, name })
      selectIngredient(ingredient)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(ingredient) {
    if (!window.confirm(`'${ingredient.name}'을(를) 목록에서 삭제할까요?`)) return
    setError('')
    try {
      await ingredientApi.deleteIngredient(ingredient.id)
      runSearch()
    } catch (err) {
      setError(err.message)
    }
  }

  if (formMode === 'edit') {
    return (
      <div className="ingredient-picker">
        <p className="ingredient-picker-hint">식재료 정보를 수정할게요.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="ing-name">식재료 이름</label>
            <input
              id="ing-name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="ing-category">카테고리</label>
              <div className="ingredient-picker-category-row">
                <CategoryIcon categoryName={form.categoryName} size={32} />
                <select
                  id="ing-category"
                  className="select"
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  required
                >
                  {categories.length === 0 && <option value="">카테고리 없음</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="ing-unit">기본 단위</label>
              <input
                id="ing-unit"
                className="input"
                placeholder="예: 개, g, ml"
                value={form.defaultUnit}
                onChange={(e) => setForm({ ...form, defaultUnit: e.target.value })}
              />
            </div>
          </div>
          <div className="ingredient-picker-actions">
            <button type="button" className="btn btn-ghost" onClick={closeForm}>
              검색으로 돌아가기
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (formMode === 'create' && createStep === 'category') {
    return (
      <div className="ingredient-picker">
        <p className="ingredient-picker-hint">어떤 종류의 재료인가요?</p>
        {error && <div className="form-error">{error}</div>}
        <div className="ingredient-category-grid">
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              className="ingredient-category-card"
              onClick={() => selectCategory(c.name)}
            >
              <CategoryIcon categoryName={c.name} size={44} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost" onClick={closeForm}>
          검색으로 돌아가기
        </button>
      </div>
    )
  }

  if (formMode === 'create' && createStep === 'pick') {
    return (
      <div className="ingredient-picker">
        <div className="ingredient-pick-header">
          <button type="button" className="ingredient-back-btn" onClick={() => setCreateStep('category')}>
            ← {form.categoryName}
          </button>
        </div>
        {error && <div className="form-error">{error}</div>}

        {suggestionsLoading ? (
          <p className="form-hint">불러오는 중...</p>
        ) : (
          <div className="ingredient-category-grid">
            {suggestions.map((name) => (
              <button
                type="button"
                key={name}
                className="ingredient-category-card"
                onClick={() => handleSuggestionClick(name)}
                disabled={submitting}
              >
                <CategoryIcon categoryName={form.categoryName} size={44} />
                <span>{name}</span>
              </button>
            ))}
          </div>
        )}

        {!manualEntry ? (
          <button
            type="button"
            className="btn btn-ghost btn-block ingredient-picker-new"
            onClick={() => setManualEntry(true)}
          >
            + 목록에 없나요? 직접 입력하기
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="ingredient-manual-form">
            <div className="field-row">
              <div className="field">
                <label htmlFor="ing-name">식재료 이름</label>
                <input
                  id="ing-name"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="ing-unit">기본 단위 (선택)</label>
                <input
                  id="ing-unit"
                  className="input"
                  placeholder="예: 개, g, ml"
                  value={form.defaultUnit}
                  onChange={(e) => setForm({ ...form, defaultUnit: e.target.value })}
                />
              </div>
            </div>
            <div className="ingredient-picker-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setManualEntry(false)}>
                취소
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '등록 중...' : '등록하고 선택'}
              </button>
            </div>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="ingredient-picker">
      <input
        className="input"
        placeholder="식재료 이름 검색 (예: 계란, 대파)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        autoFocus
      />

      {fridgeId && (
        <div className="ingredient-recognition-row">
          <button type="button" className="ingredient-recognition-btn" onClick={() => setShowReceiptScan(true)}>
            <span className="ingredient-recognition-icon">🧾</span>
            영수증 인식
            <span className="ingredient-recognition-desc">종이 영수증</span>
          </button>
          <button
            type="button"
            className="ingredient-recognition-btn"
            onClick={() => handleDummyRecognition('주문 내역 인식')}
          >
            <span className="ingredient-recognition-icon">🛍️</span>
            주문 내역 인식
            <span className="ingredient-recognition-desc">컬리·네이버·쿠팡</span>
          </button>
          <button
            type="button"
            className="ingredient-recognition-btn"
            onClick={() => handleDummyRecognition('재료 인식')}
          >
            <span className="ingredient-recognition-icon">🍎</span>
            재료 인식
            <span className="ingredient-recognition-desc">사진으로 인식</span>
          </button>
        </div>
      )}

      {recentIngredients.length > 0 && (
        <div className="ingredient-recent">
          <p className="ingredient-recent-title">최근 선택한 재료</p>
          <div className="ingredient-recent-chips">
            {recentIngredients.map((ingredient) => (
              <button
                type="button"
                key={ingredient.id}
                className="ingredient-recent-chip"
                onClick={() => selectIngredient(ingredient)}
              >
                <CategoryIcon categoryName={ingredient.categoryName} size={18} />
                {ingredient.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      <div className="ingredient-picker-results">
        {loading && <p className="ingredient-picker-hint">검색 중...</p>}
        {!loading && results.length === 0 && (
          <p className="ingredient-picker-hint">
            {keyword ? '검색 결과가 없어요.' : '식재료 이름을 입력해서 검색해보세요.'}
          </p>
        )}
        {!loading &&
          results.map((ingredient) => (
            <div key={ingredient.id} className="ingredient-picker-result">
              <button
                type="button"
                className="ingredient-picker-result-main"
                onClick={() => selectIngredient(ingredient)}
              >
                <CategoryIcon categoryName={ingredient.categoryName} size={32} />
                <span className="ingredient-picker-result-text">
                  <span className="ingredient-picker-result-name">{ingredient.name}</span>
                  <span className="ingredient-picker-result-tags">
                    {ingredient.categoryName && (
                      <span className="ingredient-picker-result-category">{ingredient.categoryName}</span>
                    )}
                    <ReferenceNutritionTag ingredient={ingredient} />
                  </span>
                </span>
              </button>
              <div className="ingredient-picker-result-actions">
                <button type="button" className="btn btn-ghost" onClick={() => openEditForm(ingredient)}>
                  수정
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(ingredient)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
      </div>

      <button type="button" className="btn btn-ghost btn-block ingredient-picker-new" onClick={openCreateForm}>
        + 목록에 없는 새 식재료 등록하기
      </button>

      {showReceiptScan && (
        <ReceiptScanModal
          fridgeId={fridgeId}
          onClose={() => setShowReceiptScan(false)}
          onComplete={onReceiptDone}
        />
      )}
    </div>
  )
}
