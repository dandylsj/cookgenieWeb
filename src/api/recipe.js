import { client } from './client'

/** 냉장고 재료를 기반으로 Claude가 새 레시피 1개를 생성하고 저장한다. 응답이 느릴 수 있다(LLM 호출). */
export function generateRecipe(fridgeId, note) {
  return client.post(`/fridges/${fridgeId}/recipes/generate`, note ? { note } : {})
}

/** 냉장고 재료와 겹치는 정도순으로 기존에 저장된 레시피를 추천한다. */
export function getRecommendations(fridgeId, limit) {
  return client.get(`/fridges/${fridgeId}/recipes/recommendations`, { params: limit ? { limit } : {} })
}

/** 저장된 전체 레시피 목록 (최신순). */
export function getAllRecipes() {
  return client.get('/recipes')
}

export function getRecipe(id) {
  return client.get(`/recipes/${id}`)
}

export function deleteRecipe(id) {
  return client.delete(`/recipes/${id}`)
}
