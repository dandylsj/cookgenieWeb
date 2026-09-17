import { client } from './client'

/**
 * 실물 식품 상품(포장/라벨) 사진을 업로드해서 식재료 후보 목록을 추출한다 (미리보기만, 저장 안 됨).
 * 응답 형태는 receipt.scanReceipt와 동일하다.
 */
export function scanProduct(fridgeId, imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)
  return client.post(`/fridges/${fridgeId}/products/scan`, formData)
}
