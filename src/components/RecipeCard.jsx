import './RecipeCard.css'

const RECIPE_TYPE_LABEL = { AI: 'AI 생성', YOUTUBE: '유튜브', USER: '내가 등록' }

export default function RecipeCard({ recipe, onClick, onDelete }) {
  const hasMatch = recipe.totalIngredientCount != null
  return (
    <div className="recipe-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="recipe-card-top">
        <span className="recipe-card-type">{RECIPE_TYPE_LABEL[recipe.recipeType] ?? recipe.recipeType}</span>
        {onDelete && (
          <button
            type="button"
            className="recipe-card-delete"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(recipe)
            }}
            aria-label="레시피 삭제"
          >
            ×
          </button>
        )}
      </div>
      <h3 className="recipe-card-title">{recipe.title}</h3>
      <p className="recipe-card-meta">
        {recipe.cookingType ? `${recipe.cookingType} · ` : ''}
        {recipe.servingSize ? `${recipe.servingSize}인분` : ''}
        {recipe.caloriesPerServing != null ? ` · ${recipe.caloriesPerServing}kcal` : ''}
      </p>
      {hasMatch && (
        <p className="recipe-card-match">
          보유 재료 {recipe.matchedIngredientCount}/{recipe.totalIngredientCount}개 일치
        </p>
      )}
    </div>
  )
}
