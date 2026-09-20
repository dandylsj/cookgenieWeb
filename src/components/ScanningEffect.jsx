import { useEffect, useState } from 'react'
import './ScanningEffect.css'

/**
 * 사진 인식(영수증/주문내역/실물 상품) 대기 중 보여주는 스캔 애니메이션. 서버가 단일 응답만 주기
 * 때문에 실제 진행률은 알 수 없어서, 95%까지 점점 느려지며 다가가는 가짜 진행률로 "분석 중"이라는
 * 느낌만 준다 — 100%는 부모가 결과를 받아 이 컴포넌트를 언마운트할 때 자연스럽게 끝난다.
 */
export default function ScanningEffect({ imageSrc, hint }) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        const next = prev + (95 - prev) * 0.06
        return next > 94.5 ? 95 : next
      })
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="scan-effect">
      <div className="scan-effect-frame">
        <img src={imageSrc} alt="분석 중인 사진" />
        <div className="scan-effect-line" />
        <span className="scan-effect-corner scan-effect-corner--tl" />
        <span className="scan-effect-corner scan-effect-corner--tr" />
        <span className="scan-effect-corner scan-effect-corner--bl" />
        <span className="scan-effect-corner scan-effect-corner--br" />
      </div>
      <div className="scan-effect-status">
        <div className="scan-effect-bar">
          <div className="scan-effect-bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="scan-effect-percent">{Math.round(percent)}%</span>
      </div>
      <p className="scan-effect-hint">{hint}</p>
    </div>
  )
}
