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

/** 농촌진흥청 원재료 영양정보 공공데이터 전체를 동기화한다. 데이터 양이 많아 시간이 걸릴 수 있다. */
export function syncRawMaterials() {
  return client.post('/ingredients/sync-raw-materials')
}
