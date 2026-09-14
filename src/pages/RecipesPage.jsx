import { useCallback, useEffect, useState } from 'react'
import { useFridge } from '../context/FridgeContext'
import * as recipeApi from '../api/recipe'
import RecipeCard from '../components/RecipeCard'
import RecipeDetailModal from '../components/RecipeDetailModal'
import GenerateRecipeModal from '../components/GenerateRecipeModal'
import YoutubeSearchModal from '../components/YoutubeSearchModal'
import EmptyFridgeState from '../components/EmptyFridgeState'
import './RecipesPage.css'

const TABS = [
  { value: 'recommended', label: '냉장고 재료로 추천' },
  { value: 'all', label: '전체 레시피' },
]

export default function RecipesPage() {
  const { selectedFridge, loading: fridgeLoading } = useFridge()
  const [tab, setTab] = useState('recommended')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openRecipeId, setOpenRecipeId] = useState(null)
  const [showGenerate, setShowGenerate] = useState(false)
  const [showYoutubeSearch, setShowYoutubeSearch] = useState(false)

  const fridgeId = selectedFridge?.id

  const loadRecipes = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data =
        tab === 'recommended' && fridgeId
          ? await recipeApi.getRecommendations(fridgeId)
          : await recipeApi.getAllRecipes()
      setRecipes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [tab, fridgeId])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  async function handleGenerate(note) {
    const recipe = await recipeApi.generateRecipe(fridgeId, note)
    await loadRecipes()
    setOpenRecipeId(recipe.id)
  }

  async function handleDelete(recipe) {
    if (!window.confirm(`'${recipe.title}' 레시피를 삭제할까요?`)) return
    await recipeApi.deleteRecipe(recipe.id)
    await loadRecipes()
  }

  async function handleYoutubeImported(recipe) {
    setShowYoutubeSearch(false)
    await loadRecipes()
    setOpenRecipeId(recipe.id)
  }

  if (!fridgeLoading && !selectedFridge) {
    return <EmptyFridgeState />
  }

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <div>
          <h1>레시피 추천</h1>
          <p>{selectedFridge ? `${selectedFridge.name}의 재료로 레시피를 찾아봐요` : ''}</p>
        </div>
        <div className="recipes-header-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowYoutubeSearch(true)}
            disabled={!fridgeId}
          >
            유튜브에서 찾기
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowGenerate(true)}
            disabled={!fridgeId}
          >
            + AI 레시피 생성
          </button>
        </div>
      </div>

      <div className="recipes-tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`sort-chip${tab === t.value ? ' sort-chip--active' : ''}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p className="recipes-empty">불러오는 중...</p>
      ) : recipes.length === 0 ? (
        <p className="recipes-empty">
          {tab === 'recommended'
            ? '냉장고 재료와 겹치는 레시피가 아직 없어요. AI 레시피를 먼저 만들어보세요.'
            : '아직 생성된 레시피가 없어요.'}
        </p>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setOpenRecipeId(recipe.id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {openRecipeId && (
        <RecipeDetailModal
          recipeId={openRecipeId}
          onClose={() => setOpenRecipeId(null)}
          onDeleted={loadRecipes}
        />
      )}

      {showGenerate && (
        <GenerateRecipeModal onClose={() => setShowGenerate(false)} onGenerate={handleGenerate} />
      )}

      {showYoutubeSearch && (
        <YoutubeSearchModal
          fridgeId={fridgeId}
          onClose={() => setShowYoutubeSearch(false)}
          onImported={handleYoutubeImported}
        />
      )}
    </div>
  )
}
