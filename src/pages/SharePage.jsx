import ComingSoonPage from './ComingSoonPage'

export default function SharePage() {
  return (
    <ComingSoonPage
      title="냉장고 공유"
      description="가족이나 룸메이트의 닉네임을 입력해서 초대하면, 하나의 냉장고를 함께 관리할 수 있게 될 예정이에요."
      previewItems={[
        { emoji: '🤝', title: '닉네임으로 초대', desc: '상대방 닉네임만 알면 바로 초대 가능' },
        { emoji: '👥', title: '공동 관리', desc: '초대된 멤버 모두 재료를 추가/수정' },
      ]}
    />
  )
}
