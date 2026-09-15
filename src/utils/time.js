export function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return '오늘'
  if (diffDays < 7) return `${diffDays}일 전`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`
  return `${Math.floor(diffDays / 365)}년 전`
}

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * items의 createdAt을 날짜별로 집계해 최근 weeksBack주 분량의 달력형 활동 데이터를 만든다.
 * GitHub 잔디밭처럼 일요일 시작 7행 x N열 그리드로 반환한다.
 */
export function buildActivityCalendar(items, weeksBack = 18) {
  const counts = new Map()
  items.forEach((item) => {
    if (!item.createdAt) return
    const key = toDateKey(new Date(item.createdAt))
    counts.set(key, (counts.get(key) || 0) + 1)
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
  const totalDays = weeksBack * 7
  const start = new Date(endOfWeek)
  start.setDate(endOfWeek.getDate() - totalDays + 1)

  const weeks = []
  let monthLabels = []
  let lastMonth = null
  for (let w = 0; w < weeksBack; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const key = toDateKey(date)
      const isFuture = date > today
      week.push({ date, key, count: isFuture ? null : counts.get(key) || 0 })
      if (d === 0) {
        const month = date.getMonth()
        if (month !== lastMonth) {
          monthLabels.push({ weekIndex: w, label: `${month + 1}월` })
          lastMonth = month
        }
      }
    }
    weeks.push(week)
  }

  return { weeks, monthLabels }
}

export function activityLevel(count) {
  if (count == null) return -1
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}
