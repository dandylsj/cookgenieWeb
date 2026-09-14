import { formatNutrition, hasNutrition } from '../utils/nutrition'
import './NutritionTag.css'

export default function NutritionTag({ item }) {
  if (!hasNutrition(item)) {
    return (
      <span
        className="nutrition-tag nutrition-tag--empty"
        title="이 재료는 아직 영양정보가 없어요. 재료의 단위가 영양정보 기준 단위와 다르거나(예: 개 vs g), 공식 데이터와 매칭되지 않은 재료일 수 있어요."
      >
        영양정보 없음
      </span>
    )
  }
  return <span className="nutrition-tag">{formatNutrition(item)}</span>
}
