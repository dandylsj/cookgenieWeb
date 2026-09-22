import { hasReferenceNutrition, nutritionSourceLabel, referenceNutritionParts } from '../utils/nutrition'
import './NutritionTag.css'

/** 재료 검색 결과에 "100g당 47kcal..." 형태로 기준량 영양정보를 보여준다. 없으면 표시하지 않는다
 * (검색 결과 목록은 항목이 많아 "정보 없음" 배지를 매번 넣으면 오히려 지저분해지기 때문). */
export default function ReferenceNutritionTag({ ingredient }) {
  if (!hasReferenceNutrition(ingredient)) return null
  const source = nutritionSourceLabel(ingredient.dataSource, ingredient.isVerified)
  const { basis, parts } = referenceNutritionParts(ingredient)
  // 항목별로 나눠 둬야 좁은 화면에서 글자 중간이 아니라 항목 단위로 줄바꿈된다.
  return (
    <span className="nutrition-tag nutrition-tag--segments" title="식재료 100g(또는 표시된 기준량)당 영양정보예요.">
      {basis && <span className="nutrition-seg nutrition-seg--basis">{basis}</span>}
      {parts.map((part) => (
        <span key={part} className="nutrition-seg">
          {part}
        </span>
      ))}
      {source && <span className={`nutrition-source ${source.className}`}>{source.text}</span>}
    </span>
  )
}
