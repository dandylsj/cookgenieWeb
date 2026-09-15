/** 검증된 카테고리 팔레트 (고정 순서). 색맹 시뮬레이션까지 통과한 순서라 절대 임의로 섞지 않는다. */
export const CATEGORICAL_PALETTE = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
]

export const OTHER_COLOR = '#c3c2b7'

/** count 내림차순으로 정렬한 뒤, 팔레트 색을 고정 순서로 배정한다. 8개를 넘으면 나머지는 "기타"로 합친다. */
export function assignCategoricalColors(entries) {
  const sorted = [...entries].sort((a, b) => b.count - a.count)
  if (sorted.length <= CATEGORICAL_PALETTE.length) {
    return sorted.map((entry, i) => ({ ...entry, color: CATEGORICAL_PALETTE[i] }))
  }
  const head = sorted.slice(0, CATEGORICAL_PALETTE.length - 1).map((entry, i) => ({
    ...entry,
    color: CATEGORICAL_PALETTE[i],
  }))
  const tailCount = sorted.slice(CATEGORICAL_PALETTE.length - 1).reduce((sum, e) => sum + e.count, 0)
  return [...head, { label: '기타', count: tailCount, color: OTHER_COLOR }]
}
