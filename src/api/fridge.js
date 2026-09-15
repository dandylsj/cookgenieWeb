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
