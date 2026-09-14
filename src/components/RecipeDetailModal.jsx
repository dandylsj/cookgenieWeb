import { useEffect, useState } from 'react'
import * as recipeApi from '../api/recipe'
import Modal from './Modal'
import '../styles/forms.css'
import './RecipeDetailModal.css'

const RECIPE_TYPE_LABEL = { AI: 'AI 생성', YOUTUBE: '유튜브', USER: '내가 등록' }

export default function RecipeDetailModal({ recipeId, onClose, onDeleted }) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    recipeApi
      .getRecipe(recipeId)
      .then(setRecipe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [recipeId])

  async function handleDelete() {
    if (!window.confirm('이 레시피를 삭제할까요?')) return
    setDeleting(true)
    try {
      await recipeApi.deleteRecipe(recipeId)
      onDeleted(recipeId)
      onClose()
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <Modal
      title={recipe ? recipe.title : '레시피'}
      onClose={onClose}
      width={560}
      footer={
        recipe && (
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? '삭제 중...' : '레시피 삭제'}
          </button>
        )
      }
    >
      {loading && <p className="recipe-detail-hint">불러오는 중...</p>}
      {error && <div className="form-error">{error}</div>}

      {recipe && (
        <div className="recipe-detail">
          <div className="recipe-detail-tags">
            <span className="recipe-detail-type">
              {RECIPE_TYPE_LABEL[recipe.recipeType] ?? recipe.recipeType}
            </span>
            {recipe.tags?.map((tag) => (
              <span key={tag} className="recipe-detail-tag">
                #{tag}
              </span>
            ))}
          </div>

          <p className="recipe-detail-meta">
            {recipe.cookingType ? `${recipe.cookingType} · ` : ''}
            {recipe.servingSize ? `${recipe.servingSize}인분` : ''}
            {recipe.caloriesPerServing != null ? ` · ${recipe.caloriesPerServing}kcal` : ''}
            {recipe.carbohydrateG != null ? ` · 탄 ${recipe.carbohydrateG}g` : ''}
            {recipe.proteinG != null ? ` · 단 ${recipe.proteinG}g` : ''}
            {recipe.fatG != null ? ` · 지 ${recipe.fatG}g` : ''}
          </p>

          {recipe.sourceUrl && (
            <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="recipe-detail-source">
              원본 보기 ↗
            </a>
          )}

          <h4 className="recipe-detail-section-title">재료</h4>
          <ul className="recipe-detail-ingredients">
            {recipe.ingredients?.map((ing) => (
              <li key={ing.id} className={ing.matched ? 'is-matched' : ''}>
                <span>{ing.ingredientNameText}</span>
                <span className="recipe-detail-ingredient-qty">{ing.quantityText}</span>
              </li>
            ))}
          </ul>

          <h4 className="recipe-detail-section-title">조리 순서</h4>
          <ol className="recipe-detail-instructions">
            {recipe.instructions?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </Modal>
  )
}
