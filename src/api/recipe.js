import { client } from './client'

/**
 * Claude가 새 레시피 1개를 생성하고 저장한다. 응답이 느릴 수 있다(LLM 호출).
 * useFridgeIngredients가 false면 냉장고 재료와 무관하게 note 요청 내용만으로 자유롭게 생성한다.
 */
export function generateRecipe(fridgeId, note, useFridgeIngredients = true) {
  return client.post(`/fridges/${fridgeId}/recipes/generate`, {
    ...(note ? { note } : {}),
    useFridgeIngredients,
  })
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

/** 유튜브에서 레시피 영상을 검색한다 (미리보기만, 저장 안 됨). keyword를 안 주면 냉장고 재료 이름으로 자동 검색한다. */
export function searchYoutubeRecipes(fridgeId, keyword, limit) {
  return client.get(`/fridges/${fridgeId}/recipes/youtube/search`, {
    params: { ...(keyword ? { keyword } : {}), ...(limit ? { limit } : {}) },
  })
}

/** 검색된 유튜브 영상 하나를 실제 레시피로 가져와 저장한다 (Claude가 자막/설명을 분석하므로 시간이 걸릴 수 있다). */
export function importYoutubeVideo(videoId) {
  return client.post('/recipes/youtube/import', { videoId })
}
