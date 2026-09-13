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
