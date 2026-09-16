import { client } from './client'

/** 냉장고의 장보기 리스트 전체 조회 (미완료가 먼저, 그다음 최신순). */
export function getShoppingItems(fridgeId) {
  return client.get(`/fridges/${fridgeId}/shopping-items`)
}

/** 장보기 리스트에 항목을 하나 추가한다 (이름만 저장, 영양정보 추정 없음). */
export function addShoppingItem(fridgeId, name) {
  return client.post(`/fridges/${fridgeId}/shopping-items`, { name })
}

export function updateShoppingItemChecked(fridgeId, itemId, checked) {
  return client.patch(`/fridges/${fridgeId}/shopping-items/${itemId}`, { checked })
}

export function deleteShoppingItem(fridgeId, itemId) {
  return client.delete(`/fridges/${fridgeId}/shopping-items/${itemId}`)
}

/** 키워드로 쿠팡 최저가 상품을 검색한다 (쿠팡파트너스 Open API 연동, 키가 없으면 빈 배열). */
export function searchCoupangProducts(keyword, limit) {
  return client.get('/coupang/search', { params: { keyword, ...(limit ? { limit } : {}) } })
}
