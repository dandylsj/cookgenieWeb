import { client } from './client'

/** logType='RECIPE'면 {recipeId, servings}, 'FREEFORM'이면 {items: [{ingredientId, quantity, unit}]}를 함께 보낸다. */
export function createMealLog(payload) {
  return client.post('/meal-logs', payload)
}

/** 하루 6개 식사 슬롯 상세 + 목표 대비 섭취량. */
export function getDailyMealLog(date) {
  return client.get('/meal-logs', { params: { date } })
}

/** 달력용 날짜별 요약. 기록이 있는 날짜만 내려온다. */
export function getCalendarSummary(startDate, endDate) {
  return client.get('/meal-logs/calendar', { params: { startDate, endDate } })
}

export function deleteMealLog(id) {
  return client.delete(`/meal-logs/${id}`)
}

/** 목표 칼로리/탄단지 등록. effectiveDate를 생략하면 오늘부터 적용된다. */
export function setNutritionGoal(payload) {
  return client.post('/nutrition-goals', payload)
}

/** date 기준 적용 중인 목표. 설정된 목표가 없으면 null이 온다. */
export function getCurrentGoal(date) {
  return client.get('/nutrition-goals/current', { params: date ? { date } : {} })
}
