import { client } from './client'

export function createFridge(name) {
  return client.post('/fridges', { name })
}

export function getMyFridges() {
  return client.get('/fridges')
}

export function getFridge(fridgeId) {
  return client.get(`/fridges/${fridgeId}`)
}

export function deleteFridge(fridgeId) {
  return client.delete(`/fridges/${fridgeId}`)
}

/** 냉장고 초대코드를 새로 발급한다 (OWNER만 가능, 7일 유효, 재발급 시 이전 코드는 무효화됨). */
export function createInviteCode(fridgeId) {
  return client.post(`/fridges/${fridgeId}/invite-code`)
}

/** 초대코드로 다른 사람의 냉장고에 멤버로 참여한다. */
export function joinFridgeByCode(inviteCode) {
  return client.post('/fridges/join', { inviteCode })
}

/** 냉장고 멤버 목록을 조회한다(소유자 먼저, 그다음 참여일 순). 그 냉장고의 멤버라면 누구나 조회 가능. */
export function getFridgeMembers(fridgeId) {
  return client.get(`/fridges/${fridgeId}/members`)
}

/** 멤버를 강퇴한다. OWNER만 가능하고 자기 자신은 강퇴할 수 없다. */
export function kickFridgeMember(fridgeId, userId) {
  return client.delete(`/fridges/${fridgeId}/members/${userId}`)
}

/** 본인이 냉장고에서 탈퇴한다. OWNER는 탈퇴할 수 없다(먼저 냉장고를 삭제해야 함). */
export function leaveFridge(fridgeId) {
  return client.delete(`/fridges/${fridgeId}/leave`)
}

export function getFridgeItems(fridgeId) {
  return client.get(`/fridges/${fridgeId}/items`)
}

export function createFridgeItem(fridgeId, payload) {
  return client.post(`/fridges/${fridgeId}/items`, payload)
}

export function updateFridgeItem(fridgeId, itemId, payload) {
  return client.put(`/fridges/${fridgeId}/items/${itemId}`, payload)
}

export function deleteFridgeItem(fridgeId, itemId) {
  return client.delete(`/fridges/${fridgeId}/items/${itemId}`)
}
