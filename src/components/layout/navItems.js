import { CalendarIcon, CartIcon, FridgeIcon, HomeIcon, RecipeIcon, ShareIcon } from './icons'

export const NAV_ITEMS = [
  { to: '/', label: '홈', icon: HomeIcon, end: true },
  { to: '/fridge', label: '냉장고 재료', icon: FridgeIcon },
  { to: '/recipes', label: '레시피 추천', icon: RecipeIcon },
  { to: '/calendar', label: '식단 캘린더', icon: CalendarIcon, soon: true },
  { to: '/shopping', label: '장보기', icon: CartIcon, soon: true },
  { to: '/share', label: '냉장고 공유', icon: ShareIcon, soon: true },
]

/** 하단 탭바는 자리가 좁아서 대표 5개만 보여준다 (냉장고 공유는 제외). */
export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.to !== '/share')
