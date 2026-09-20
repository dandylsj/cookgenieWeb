import { useEffect, useState } from 'react'
import './RecipeThinkingSteps.css'

const DEFAULT_STEPS = [
  '냉장고 재료 살펴보는 중',
  '어울리는 조합 고민하는 중',
  '최적의 맛 균형 찾는 중',
  '조리 순서 정리하는 중',
]

/**
 * AI 레시피 생성 대기 중 보여주는 단계별 체크리스트 애니메이션. 실제 서버 진행 단계를 알 수 없어서
 * 일정 간격으로 다음 단계를 체크해나가고, 마지막 단계에서는 실제 응답이 올 때까지 점 애니메이션으로
 * "아직 만드는 중"임을 보여준다.
 */
export default function RecipeThinkingSteps({ steps = DEFAULT_STEPS, stepDurationMs = 1600 }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= steps.length - 1) return
    const timer = setTimeout(() => setActiveIndex((i) => i + 1), stepDurationMs)
    return () => clearTimeout(timer)
  }, [activeIndex, steps.length, stepDurationMs])

  return (
    <ul className="thinking-steps">
      {steps.map((label, index) => {
        const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending'
        return (
          <li key={label} className={`thinking-step thinking-step--${state}`}>
            <span className="thinking-step-mark">{state === 'done' ? '✓' : index + 1}</span>
            <span className="thinking-step-label">{label}</span>
            {state === 'active' && (
              <span className="thinking-step-dots">
                <span />
                <span />
                <span />
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
