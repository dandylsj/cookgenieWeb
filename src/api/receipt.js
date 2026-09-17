import { client } from './client'

/**
 * 영수증 사진을 업로드해서 식재료 후보 목록을 추출한다 (미리보기만, 저장 안 됨).
 * Claude 비전 분석이라 시간이 걸릴 수 있다.
 */
export function scanReceipt(fridgeId, imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)
  // Content-Type을 직접 지정하지 않아야 axios가 boundary가 포함된 multipart 헤더를 자동으로 붙여준다.
  return client.post(`/fridges/${fridgeId}/receipts/scan`, formData)
}

/**
 * 쿠팡/마켓컬리/네이버쇼핑 같은 온라인 쇼핑몰 주문내역(구매내역) 화면 캡처를 업로드해서 식재료 후보 목록을
 * 추출한다 (미리보기만, 저장 안 됨). 응답 형태는 scanReceipt와 동일하다.
 */
export function scanOrderHistory(fridgeId, imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)
  return client.post(`/fridges/${fridgeId}/receipts/scan-order-history`, formData)
}
