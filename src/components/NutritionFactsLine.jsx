import './NutritionTag.css'

/** nutritionFacts()가 만든 {basis, facts} + nutritionSourceLabel()이 만든 source를 한 줄로 보여준다.
 * 기준량은 옅게, kcal은 진하게, 탄단지는 옅게 표시하고 출처 뱃지를 끝에 붙인다. */
export default function NutritionFactsLine({ basis, facts, source }) {
  if (!facts || facts.length === 0) return null
  return (
    <div className="nutrition-facts-line">
      {basis && <span className="nutrition-facts-basis">{basis}</span>}
      {facts.map((fact, i) => (
        <span
          key={i}
          className={fact.type === 'kcal' ? 'nutrition-facts-kcal' : 'nutrition-facts-macro'}
        >
          {fact.text}
        </span>
      ))}
      {source && <span className={`nutrition-source ${source.className}`}>{source.text}</span>}
    </div>
  )
}
