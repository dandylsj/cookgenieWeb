import { client } from './client'

export function searchIngredients(keyword) {
  return client.get('/ingredients', { params: keyword ? { keyword } : {} })
}

export function getCategories() {
  return client.get('/ingredients/categories')
}

export function createIngredient({ name, categoryName, defaultUnit }) {
  return client.post('/ingredients', { name, categoryName, defaultUnit })
}

export function updateIngredient(id, { name, categoryName, defaultUnit }) {
  return client.put(`/ingredients/${id}`, { name, categoryName, defaultUnit })
}

export function deleteIngredient(id) {
  return client.delete(`/ingredients/${id}`)
}

/** 재료 추가 화면에서 카테고리를 고르면 보여줄 자주 쓰는 재료 이름 목록 (DB/AI 호출 없는 정적 목록). */
export function getIngredientSuggestions(categoryId) {
  return client.get(`/ingredients/categories/${categoryId}/suggestions`)
}
