import { useEffect, useState } from 'react'
import * as recipeApi from '../api/recipe'
import Modal from './Modal'
import Button from './Button'
import '../styles/forms.css'
import './RecipeDetailModal.css'

const RECIPE_TYPE_LABEL = { AI: 'AI 생성', YOUTUBE: '유튜브', USER: '내가 등록' }

// 조리 순서 문장에서 시간("4분", "약 30초")·불 세기("중불" 등) 표현을 강조 표시한다.
const STEP_HIGHLIGHT_PATTERN = /(\d+~?\d*\s?(?:시간|분|초)간?|약한?불|중약불|중강불|중불|강불|센불)/g

function renderStepText(step) {
  const parts = step.split(STEP_HIGHLIGHT_PATTERN)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="recipe-step-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export default function RecipeDetailModal({ recipeId, fridgeId, onClose, onDeleted, onAddToShopping }) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [addedNames, setAddedNames] = useState([])
  const [addingName, setAddingName] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    recipeApi
      .getRecipe(recipeId, fridgeId)
      .then(setRecipe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [recipeId, fridgeId])

  async function handleAddToShopping(ing) {
    if (!onAddToShopping) return
    setAddingName(ing.ingredientNameText)
    try {
      await onAddToShopping(ing.ingredientNameText)
      setAddedNames((prev) => [...prev, ing.ingredientNameText])
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingName(null)
    }
  }

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
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? '삭제 중...' : '레시피 삭제'}
          </Button>
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
              {recipe.authorNickname ? `${recipe.authorNickname} · 원본 보기 ↗` : '원본 보기 ↗'}
            </a>
          )}

          <h4 className="recipe-detail-section-title">재료</h4>
          <ul className="recipe-detail-ingredients">
            {recipe.ingredients?.map((ing) => {
              const isAdded = addedNames.includes(ing.ingredientNameText)
              const showAddButton = onAddToShopping && ing.inFridge === false
              return (
                <li key={ing.id} className={ing.matched ? 'is-matched' : ''}>
                  <span>{ing.ingredientNameText}</span>
                  <span className="recipe-detail-ingredient-right">
                    <span className="recipe-detail-ingredient-qty">{ing.quantityText}</span>
                    {showAddButton && (
                      <button
                        type="button"
                        className="recipe-detail-add-btn"
                        disabled={isAdded || addingName === ing.ingredientNameText}
                        onClick={() => handleAddToShopping(ing)}
                      >
                        {isAdded ? '담았어요' : addingName === ing.ingredientNameText ? '담는 중...' : '🛒 담기'}
                      </button>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>

          <h4 className="recipe-detail-section-title">조리 순서</h4>
          <ol className="recipe-detail-instructions">
            {recipe.instructions?.map((step, i) => (
              <li key={i}>
                <span className="recipe-step-badge">{i + 1}</span>
                <span className="recipe-step-text">{renderStepText(step)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Modal>
  )
}
