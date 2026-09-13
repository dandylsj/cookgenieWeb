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
