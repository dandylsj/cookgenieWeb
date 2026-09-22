import { useEffect, useState } from 'react'
import * as recipeApi from '../api/recipe'
import RecipeCard from './RecipeCard'
import RecipeCardSkeleton from './RecipeCardSkeleton'
import YoutubeRecipeSection from './YoutubeRecipeSection'
import Button from './Button'
import '../styles/forms.css'
import './YoutubeDiscovery.css'

const CATEGORY_SECTIONS = [
  { key: 'fridge', label: '냉장고 재료로 추천', keyword: null },
  { key: 'popular', label: '이번 주 인기 레시피', keyword: '이번주 인기 레시피' },
  { key: 'solo', label: '자취생 레시피', keyword: '자취생 요리 레시피' },
  { key: 'diet', label: '맛있는 다이어트 레시피', keyword: '다이어트 레시피' },
  { key: 'easy', label: '초간단 레시피', keyword: '초간단 요리 레시피' },
  { key: 'budget', label: '가성비 레시피', keyword: '가성비 요리 레시피' },
]

const EMPTY_SECTION_STATE = { videos: [], loading: true, error: '' }

export default function YoutubeDiscovery({ fridgeId, savedRecipes, savedLoading, onImported, onDeleteSaved, onOpenRecipe }) {
  const [sections, setSections] = useState(() =>
    Object.fromEntries(CATEGORY_SECTIONS.map((cat) => [cat.key, EMPTY_SECTION_STATE]))
  )
  const [keyword, setKeyword] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [importingId, setImportingId] = useState(null)
  const [importError, setImportError] = useState('')

  useEffect(() => {
    if (!fridgeId) return
    CATEGORY_SECTIONS.forEach((cat) => {
      setSections((prev) => ({ ...prev, [cat.key]: { videos: [], loading: true, error: '' } }))
      recipeApi
        .searchYoutubeRecipes(fridgeId, cat.keyword, 8)
        .then((videos) => setSections((prev) => ({ ...prev, [cat.key]: { videos, loading: false, error: '' } })))
        .catch((err) =>
          setSections((prev) => ({ ...prev, [cat.key]: { videos: [], loading: false, error: err.message } }))
        )
    })
  }, [fridgeId])

  function handleSearchSubmit(event) {
    event.preventDefault()
    const trimmed = keyword.trim()
    if (!trimmed) {
      setSearchResult(null)
      return
    }
    setSearchResult({ videos: [], loading: true, error: '' })
    recipeApi
      .searchYoutubeRecipes(fridgeId, trimmed, 12)
      .then((videos) => setSearchResult({ videos, loading: false, error: '' }))
      .catch((err) => setSearchResult({ videos: [], loading: false, error: err.message }))
  }

  async function handleImport(video) {
    setImportingId(video.videoId)
    setImportError('')
    try {
      const recipe = await recipeApi.importYoutubeVideo(video.videoId)
      await onImported(recipe)
    } catch (err) {
      setImportError(err.message)
    } finally {
      setImportingId(null)
    }
  }

  return (
    <div className="youtube-discovery">
      <form onSubmit={handleSearchSubmit} className="youtube-search-form">
        <input
          className="input"
          placeholder="레시피 검색 (예: 김치찌개, 파스타)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button type="submit">
          검색
        </Button>
      </form>

      {importError && <div className="form-error">{importError}</div>}

      {searchResult && (
        <YoutubeRecipeSection
          title="검색 결과"
          videos={searchResult.videos}
          loading={searchResult.loading}
          error={searchResult.error}
          importingId={importingId}
          onImport={handleImport}
        />
      )}

      {CATEGORY_SECTIONS.map((cat) => (
        <YoutubeRecipeSection
          key={cat.key}
          title={cat.label}
          videos={sections[cat.key].videos}
          loading={sections[cat.key].loading}
          error={sections[cat.key].error}
          importingId={importingId}
          onImport={handleImport}
        />
      ))}

      <div className="youtube-section">
        <h2 className="youtube-section-title">가져온 레시피</h2>
        {savedLoading ? (
          <div className="recipes-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : savedRecipes.length === 0 ? (
          <p className="form-hint">아직 가져온 유튜브 레시피가 없어요. 위에서 마음에 드는 영상을 가져와보세요.</p>
        ) : (
          <div className="recipes-grid">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => onOpenRecipe(recipe.id)}
                onDelete={onDeleteSaved}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
