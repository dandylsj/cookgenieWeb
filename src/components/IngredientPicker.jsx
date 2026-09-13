import { useCallback, useEffect, useState } from 'react'
import * as ingredientApi from '../api/ingredient'
import CategoryIcon from './CategoryIcon'
import '../styles/forms.css'
import './IngredientPicker.css'

const EMPTY_FORM = { name: '', categoryName: '', defaultUnit: '' }

/**
 * 식재료 검색 + 등록/수정/삭제까지 처리하고, 선택이 끝나면 onSelect(ingredient)를 호출한다.
 * 백엔드에 식재료 검색/생성 API가 없으면 냉장고에 재료를 추가할 방법이 없어서 만든 보조 컴포넌트.
 */
export default function IngredientPicker({ onSelect }) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [formMode, setFormMode] = useState(null) // null | 'create' | 'edit'
  const [editingId, setEditingId] = useState(null)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ingredientApi.getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

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
    setForm({ name: keyword, categoryName: categories[0]?.name ?? '', defaultUnit: '' })
    setFormMode('create')
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
        onSelect(ingredient)
      }
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

  if (formMode) {
    return (
      <div className="ingredient-picker">
        <p className="ingredient-picker-hint">
          {formMode === 'edit' ? '식재료 정보를 수정할게요.' : '검색 결과에 없는 새 식재료를 등록할게요.'}
        </p>
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
              {submitting ? '저장 중...' : formMode === 'edit' ? '수정 완료' : '등록하고 선택'}
            </button>
          </div>
        </form>
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
                onClick={() => onSelect(ingredient)}
              >
                <CategoryIcon categoryName={ingredient.categoryName} size={32} />
                <span className="ingredient-picker-result-name">{ingredient.name}</span>
                {ingredient.categoryName && (
                  <span className="ingredient-picker-result-category">{ingredient.categoryName}</span>
                )}
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
    </div>
  )
}
