import { formatNutrition, formatReferenceNutrition, hasNutrition, hasReferenceNutrition } from '../utils/nutrition'
import './NutritionTag.css'

export default function NutritionTag({ item }) {
  if (hasNutrition(item)) {
    return <span className="nutrition-tag">{formatNutrition(item)}</span>
  }

  if (hasReferenceNutrition(item)) {
    return (
      <span
        className="nutrition-tag nutrition-tag--reference"
        title="이 재료의 단위가 영양정보 기준 단위와 달라서(예: 개 vs g) 정확한 양을 계산할 수 없어요. 재료 수정에서 단위를 g/ml로 맞추면 자동 계산돼요."
      >
        {formatReferenceNutrition(item)}
      </span>
    )
  }

  return (
    <span
      className="nutrition-tag nutrition-tag--empty"
      title="이 재료는 아직 영양정보가 없어요. 재료 추가 화면에서 검색 후 '수정'을 눌러 직접 입력하거나 AI로 추정할 수 있어요."
    >
      영양정보 없음
    </span>
  )
}
