import ComingSoonPage from './ComingSoonPage'

export default function CalendarPage() {
  return (
    <ComingSoonPage
      title="식단 캘린더"
      description="날짜별로 어떤 재료로 어떤 음식을 먹었는지 기록하고, 월 단위 식습관 통계도 확인할 수 있게 될 예정이에요."
      previewItems={[
        { emoji: '📅', title: '달력형 식단 기록', desc: '끼니별 메뉴/재료를 캘린더에 기록' },
        { emoji: '📊', title: '식습관 통계', desc: '월간 영양·소비 패턴 요약' },
      ]}
    />
  )
}
