import { client } from './client'

/** categoryId를 주면 그 카테고리 안에서만 검색한다(재료 추가 화면에서 카테고리를 고른 뒤 그 안의 기존/공식 재료를 찾을 때 사용). */
export function searchIngredients(keyword, categoryId) {
  return client.get('/ingredients', { params: { ...(keyword ? { keyword } : {}), ...(categoryId ? { categoryId } : {}) } })
}

export function getCategories() {
  return client.get('/ingredients/categories')
}

/**
 * autoEstimateNutrition을 true로 주면 이름만으로 Claude가 영양정보를 추정해서 채워준다(토큰 소모).
 * calories 등을 직접 주면 그 값을 그대로 저장하고(추정 호출 안 함), 둘 다 안 주면 영양정보 없이 등록된다
 * (나중에 updateNutrition으로 직접 입력하거나 estimateNutrition으로 추정받을 수 있음).
 */
export function createIngredient({
  name,
  categoryName,
  defaultUnit,
  autoEstimateNutrition,
  calories,
  carbohydrateG,
  proteinG,
  fatG,
  referenceUnit,
}) {
  return client.post('/ingredients', {
    name,
    categoryName,
    defaultUnit,
    autoEstimateNutrition,
    calories,
    carbohydrateG,
    proteinG,
    fatG,
    referenceUnit,
  })
}

export function updateIngredient(id, { name, categoryName, defaultUnit }) {
  return client.put(`/ingredients/${id}`, { name, categoryName, defaultUnit })
}

/** 식재료의 100g(또는 ml) 기준 영양정보를 직접 입력/수정한다. */
export function updateNutrition(id, { calories, carbohydrateG, proteinG, fatG, referenceUnit }) {
  return client.put(`/ingredients/${id}/nutrition`, { calories, carbohydrateG, proteinG, fatG, referenceUnit })
}

/** 영양정보가 없는(또는 다시 추정받고 싶은) 식재료를 그 시점에 Claude로 추정해서 채운다. */
export function estimateNutrition(id) {
  return client.post(`/ingredients/${id}/nutrition/estimate`)
}

export function deleteIngredient(id) {
  return client.delete(`/ingredients/${id}`)
}

/** 재료 추가 화면에서 카테고리를 고르면 보여줄 자주 쓰는 재료 이름 목록 (DB/AI 호출 없는 정적 목록). */
export function getIngredientSuggestions(categoryId) {
  return client.get(`/ingredients/categories/${categoryId}/suggestions`)
}

/** 식약처 가공식품 공공데이터에서 keyword(부분 일치)로 후보를 검색한다. 결과는 100g/100ml 기준으로 정규화돼 있다. */
export function searchOfficialFoods(keyword, limit) {
  return client.get('/ingredients/official-search', { params: { keyword, ...(limit ? { limit } : {}) } })
}
