/** 백엔드 MealType enum과 순서를 그대로 맞춘 6개 식사 슬롯. */
export const MEAL_TYPES = [
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'MORNING_SNACK',
  'AFTERNOON_SNACK',
  'EVENING_SNACK',
]

export const MEAL_TYPE_LABEL = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  MORNING_SNACK: '오전 간식',
  AFTERNOON_SNACK: '오후 간식',
  EVENING_SNACK: '저녁 간식',
}

/** 달력 칸의 식사별 라벨 색 구분용(순환). */
export const MEAL_TYPE_COLOR = {
  BREAKFAST: '#f2b134',
  LUNCH: '#e07a3f',
  DINNER: '#7c5cbf',
  MORNING_SNACK: '#3ea6a0',
  AFTERNOON_SNACK: '#4f8fdb',
  EVENING_SNACK: '#c0568a',
}

/** Date -> "YYYY-MM-DD"를 로컬 시간대 기준으로 만든다 (toISOString()은 UTC라서 KST 같은 +시간대에서는
 * 자정 근처 값을 하루 밀어버린다 - addDays()가 겪었던 버그와 같은 원인). */
function toDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayString() {
  return toDateString(new Date())
}

export function addDays(dateString, days) {
  const date = new Date(dateString + 'T00:00:00')
  date.setDate(date.getDate() + days)
  return toDateString(date)
}

export function formatDateLabel(dateString) {
  if (dateString === todayString()) return '오늘'
  const date = new Date(dateString + 'T00:00:00')
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}
