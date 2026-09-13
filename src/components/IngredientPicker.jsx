import { useEffect, useState } from 'react'
import * as ingredientApi from '../api/ingredient'
import '../styles/forms.css'
import './IngredientPicker.css'

/**
 * 식재료 검색 + (없으면) 신규 등록까지 처리하고, 선택이 끝나면 onSelect(ingredient)를 호출한다.
 * 백엔드에 식재료 검색/생성 API가 없으면 냉장고에 재료를 추가할 방법이 없어서 만든 보조 컴포넌트.
 */
export default function IngredientPicker({ onSelect }) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [newIngredient, setNewIngredient] = useState({ name: '', categoryName: '', defaultUnit: '' })
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    ingredientApi.getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      ingredientApi
        .searchIngredients(keyword)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [keyword])

  function openCreateForm() {
    setNewIngredient({ name: keyword, categoryName: categories[0]?.name ?? '', defaultUnit: '' })
    setShowCreateForm(true)
    setError('')
  }

  async function handleCreate(event) {
    event.preventDefault()
    setError('')
    setCreating(true)
    try {
      const ingredient = await ingredientApi.createIngredient(newIngredient)
      onSelect(ingredient)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  if (showCreateForm) {
    return (
      <div className="ingredient-picker">
        <p className="ingredient-picker-hint">검색 결과에 없는 새 식재료를 등록할게요.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="field">
            <label htmlFor="ing-name">식재료 이름</label>
            <input
              id="ing-name"
              className="input"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="ing-category">카테고리</label>
              <select
                id="ing-category"
                className="select"
                value={newIngredient.categoryName}
                onChange={(e) => setNewIngredient({ ...newIngredient, categoryName: e.target.value })}
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
            <div className="field">
              <label htmlFor="ing-unit">기본 단위</label>
              <input
                id="ing-unit"
                className="input"
                placeholder="예: 개, g, ml"
                value={newIngredient.defaultUnit}
                onChange={(e) => setNewIngredient({ ...newIngredient, defaultUnit: e.target.value })}
              />
            </div>
          </div>
          <div className="ingredient-picker-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setShowCreateForm(false)}>
              검색으로 돌아가기
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? '등록 중...' : '등록하고 선택'}
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

      <div className="ingredient-picker-results">
        {loading && <p className="ingredient-picker-hint">검색 중...</p>}
        {!loading && results.length === 0 && (
          <p className="ingredient-picker-hint">
            {keyword ? '검색 결과가 없어요.' : '식재료 이름을 입력해서 검색해보세요.'}
          </p>
        )}
        {!loading &&
          results.map((ingredient) => (
            <button
              type="button"
              key={ingredient.id}
              className="ingredient-picker-result"
              onClick={() => onSelect(ingredient)}
            >
              <span className="ingredient-picker-result-name">{ingredient.name}</span>
              {ingredient.categoryName && (
                <span className="ingredient-picker-result-category">{ingredient.categoryName}</span>
              )}
            </button>
          ))}
      </div>

      <button type="button" className="btn btn-ghost btn-block ingredient-picker-new" onClick={openCreateForm}>
        + 목록에 없는 새 식재료 등록하기
      </button>
    </div>
  )
}
