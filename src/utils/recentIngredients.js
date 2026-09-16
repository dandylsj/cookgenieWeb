const STORAGE_KEY = 'cookgenie_recent_ingredients'
const MAX_RECENT = 8

/** 최근에 선택/등록한 식재료 목록 (이 브라우저 한정, 최신순). 재료 추가 화면의 빠른 선택용. */
export function getRecentIngredients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRecentIngredient(ingredient) {
  if (!ingredient?.id) return
  try {
    const current = getRecentIngredients().filter((i) => i.id !== ingredient.id)
    const next = [
      { id: ingredient.id, name: ingredient.name, categoryName: ingredient.categoryName, defaultUnit: ingredient.defaultUnit },
      ...current,
    ].slice(0, MAX_RECENT)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // localStorage를 못 쓰는 환경(프라이빗 모드 등)이면 그냥 무시
  }
}
