/** FridgeItemResponse의 calories/carbohydrateG/proteinG/fatG는 재료의 단위가 영양정보 기준 단위와
 * 일치할 때만 채워지고, 그렇지 않으면 넷 다 null로 온다. 하나라도 값이 있으면 표시 대상으로 본다. */
export function hasNutrition(item) {
  return (
    item.calories != null || item.carbohydrateG != null || item.proteinG != null || item.fatG != null
  )
}

export function formatNutrition(item) {
  const parts = []
  if (item.calories != null) parts.push(`${item.calories}kcal`)
  if (item.carbohydrateG != null) parts.push(`탄 ${item.carbohydrateG}g`)
  if (item.proteinG != null) parts.push(`단 ${item.proteinG}g`)
  if (item.fatG != null) parts.push(`지 ${item.fatG}g`)
  return parts.join(' · ')
}

/** IngredientResponse의 reference* 필드는 재료 마스터에 등록된 "기준량당" 영양정보다 (예: 100g당).
 * 수동으로 등록한 재료(공식 데이터와 동기화되지 않은 재료)는 전부 null. */
export function hasReferenceNutrition(ingredient) {
  return (
    ingredient.referenceCalories != null ||
    ingredient.referenceCarbohydrateG != null ||
    ingredient.referenceProteinG != null ||
    ingredient.referenceFatG != null
  )
}

export function formatReferenceNutrition(ingredient) {
  const parts = []
  if (ingredient.referenceCalories != null) parts.push(`${ingredient.referenceCalories}kcal`)
  if (ingredient.referenceCarbohydrateG != null) parts.push(`탄 ${ingredient.referenceCarbohydrateG}g`)
  if (ingredient.referenceProteinG != null) parts.push(`단 ${ingredient.referenceProteinG}g`)
  if (ingredient.referenceFatG != null) parts.push(`지 ${ingredient.referenceFatG}g`)
  const basis =
    ingredient.referenceAmount != null && ingredient.referenceUnit
      ? `${ingredient.referenceAmount}${ingredient.referenceUnit}당 `
      : ''
  return basis + parts.join(' · ')
}

/**
 * 영양정보가 실제 DB(정부 공식 데이터)에서 온 건지, Claude가 추정한 건지, 사용자가 직접 입력한 건지를
 * 뱃지로 보여주기 위한 라벨. dataSource가 없으면(영양정보 자체가 없는 재료) null.
 */
export function nutritionSourceLabel(dataSource, isVerified) {
  if (dataSource === 'OFFICIAL_DB') return { text: '공식 데이터', className: 'nutrition-source--official' }
  if (dataSource === 'LLM_ESTIMATED') return { text: 'AI 추정', className: 'nutrition-source--ai' }
  if (dataSource === 'USER_INPUT' && isVerified) return { text: '직접 입력', className: 'nutrition-source--manual' }
  return null
}
