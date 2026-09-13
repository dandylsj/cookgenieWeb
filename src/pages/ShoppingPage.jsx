import ComingSoonPage from './ComingSoonPage'

export default function ShoppingPage() {
  return (
    <ComingSoonPage
      title="장보기 리스트"
      description="영수증을 촬영하면 AI가 구매 재료를 자동으로 인식해서 냉장고에 담아주고, 최저가 상품도 함께 찾아줄 예정이에요."
      previewItems={[
        { emoji: '🧾', title: '영수증 자동 인식', desc: '촬영 한 번으로 장본 재료 일괄 등록' },
        { emoji: '🛒', title: '장보기 리스트', desc: '부족한 재료를 담아두고 한 번에 장보기' },
        { emoji: '💰', title: '최저가 비교', desc: '등록한 재료의 온라인 최저가 안내' },
      ]}
    />
  )
}
