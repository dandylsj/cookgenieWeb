import ComingSoonPage from './ComingSoonPage'

export default function RecipesPage() {
  return (
    <ComingSoonPage
      title="AI 레시피 추천"
      description="냉장고에 있는 재료를 분석해서 유튜브 레시피와 AI 추천 레시피를 보여줄 예정이에요."
      previewItems={[
        { emoji: '🍳', title: '재료 기반 추천', desc: '보유 재료로 만들 수 있는 레시피 우선 노출' },
        { emoji: '▶️', title: '유튜브 레시피 연동', desc: '인기 요리 채널의 레시피를 모아보기' },
        { emoji: '✨', title: 'AI 레시피 생성', desc: '애매한 재료 조합도 AI가 메뉴를 제안' },
      ]}
    />
  )
}
