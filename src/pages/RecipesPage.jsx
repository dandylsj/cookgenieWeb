import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFridge } from '../context/FridgeContext'
import * as recipeApi from '../api/recipe'
import * as shoppingApi from '../api/shopping'
import RecipeCard from '../components/RecipeCard'
import RecipeDetailModal from '../components/RecipeDetailModal'
import GenerateRecipeModal from '../components/GenerateRecipeModal'
import YoutubeDiscovery from '../components/YoutubeDiscovery'
import EmptyFridgeState from '../components/EmptyFridgeState'
import '../styles/tabs.css'
import './RecipesPage.css'

const PRIMARY_TABS = [
  { value: 'AI', label: 'AI 레시피' },
  { value: 'YOUTUBE', label: '유튜브 레시피' },
]

const SUB_TABS = [
  { value: 'recommended', label: '냉장고 재료로 추천' },
  { value: 'all', label: '전체 레시피' },
]

export default function RecipesPage() {
  const { selectedFridge, loading: fridgeLoading } = useFridge()
  const [primaryTab, setPrimaryTab] = useState('AI')
  const [subTab, setSubTab] = useState('recommended')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openRecipeId, setOpenRecipeId] = useState(null)
  const [showGenerate, setShowGenerate] = useState(false)

  const fridgeId = selectedFridge?.id

  const loadRecipes = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // 유튜브 탭은 "가져온 레시피" 전체를 보여주고, AI 탭만 추천/전체 서브탭을 구분한다.
      const data =
        primaryTab === 'AI' && subTab === 'recommended' && fridgeId
          ? await recipeApi.getRecommendations(fridgeId)
          : await recipeApi.getAllRecipes()
      setRecipes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [primaryTab, subTab, fridgeId])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  // 백엔드가 추천/전체 API를 레시피 종류로 나눠주지 않아서, 받아온 목록을 화면에서 AI/유튜브로 나눠 보여준다.
  const visibleRecipes = useMemo(
    () => recipes.filter((r) => r.recipeType === primaryTab),
    [recipes, primaryTab]
  )

  // 추천 탭에서는 "재료가 다 있어서 바로 만들 수 있는 것"과 "몇 개는 더 사야 하는 것"을 나눠서 보여준다.
  const makeableRecipes = useMemo(
    () =>
      visibleRecipes.filter(
        (r) => r.totalIngredientCount != null && r.matchedIngredientCount === r.totalIngredientCount
      ),
    [visibleRecipes]
  )
  const partialRecipes = useMemo(
    () =>
      visibleRecipes.filter(
        (r) => r.totalIngredientCount != null && r.matchedIngredientCount < r.totalIngredientCount
      ),
    [visibleRecipes]
  )

  async function handleGenerate(note, useFridgeIngredients) {
    const recipe = await recipeApi.generateRecipe(fridgeId, note, useFridgeIngredients)
    await loadRecipes()
    setOpenRecipeId(recipe.id)
  }

  async function handleDelete(recipe) {
    if (!window.confirm(`'${recipe.title}' 레시피를 삭제할까요?`)) return
    await recipeApi.deleteRecipe(recipe.id)
    await loadRecipes()
  }

  async function handleYoutubeImported(recipe) {
    await loadRecipes()
    setOpenRecipeId(recipe.id)
  }

  async function handleAddToShopping(name) {
    await shoppingApi.addShoppingItem(fridgeId, name)
  }

  if (!fridgeLoading && !selectedFridge) {
    return <EmptyFridgeState />
  }

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>레시피 추천</h1>
        <p>{selectedFridge ? `${selectedFridge.name}의 재료로 레시피를 찾아봐요` : ''}</p>
      </div>

      <div className="primary-tabs">
        {PRIMARY_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`primary-tab${primaryTab === t.value ? ' primary-tab--active' : ''}`}
            onClick={() => setPrimaryTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {primaryTab === 'AI' && (
        <>
          <div className="recipes-tabs">
            {SUB_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`sort-chip${subTab === t.value ? ' sort-chip--active' : ''}`}
                onClick={() => setSubTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {error && <div className="form-error">{error}</div>}

          {loading ? (
            <p className="recipes-empty">불러오는 중...</p>
          ) : subTab === 'recommended' ? (
            visibleRecipes.length === 0 ? (
              <p className="recipes-empty">
                냉장고 재료와 겹치는 AI 레시피가 아직 없어요. 오른쪽 아래 버튼으로 만들어보세요.
              </p>
            ) : (
              <>
                <div className="recipes-section">
                  <h2 className="recipes-section-title recipes-section-title--ready">
                    지금 바로 만들 수 있어요 ({makeableRecipes.length})
                  </h2>
                  {makeableRecipes.length === 0 ? (
                    <p className="recipes-empty recipes-empty--inline">
                      재료가 완전히 겹치는 레시피가 아직 없어요.
                    </p>
                  ) : (
                    <div className="recipes-grid">
                      {makeableRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onClick={() => setOpenRecipeId(recipe.id)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {partialRecipes.length > 0 && (
                  <div className="recipes-section">
                    <h2 className="recipes-section-title recipes-section-title--partial">
                      재료를 조금 더 사면 만들 수 있어요 ({partialRecipes.length})
                    </h2>
                    <div className="recipes-grid">
                      {partialRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onClick={() => setOpenRecipeId(recipe.id)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          ) : visibleRecipes.length === 0 ? (
            <p className="recipes-empty">AI 레시피가 아직 없어요. 오른쪽 아래 버튼으로 만들어보세요.</p>
          ) : (
            <div className="recipes-grid">
              {visibleRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setOpenRecipeId(recipe.id)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <button type="button" className="recipes-fab" disabled={!fridgeId} onClick={() => setShowGenerate(true)}>
            + AI 레시피 생성
          </button>
        </>
      )}

      {primaryTab === 'YOUTUBE' &&
        (fridgeId ? (
          <YoutubeDiscovery
            fridgeId={fridgeId}
            savedRecipes={visibleRecipes}
            savedLoading={loading}
            onImported={handleYoutubeImported}
            onDeleteSaved={handleDelete}
            onOpenRecipe={setOpenRecipeId}
          />
        ) : (
          <p className="recipes-empty">냉장고를 먼저 선택해주세요.</p>
        ))}

      {openRecipeId && (
        <RecipeDetailModal
          recipeId={openRecipeId}
          fridgeId={fridgeId}
          onClose={() => setOpenRecipeId(null)}
          onDeleted={loadRecipes}
          onAddToShopping={fridgeId ? handleAddToShopping : undefined}
        />
      )}

      {showGenerate && (
        <GenerateRecipeModal onClose={() => setShowGenerate(false)} onGenerate={handleGenerate} />
      )}
    </div>
  )
}
