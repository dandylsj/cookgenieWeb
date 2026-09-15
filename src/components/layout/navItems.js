import { CalendarIcon, CartIcon, FridgeIcon, HomeIcon, RecipeIcon, ShareIcon } from './icons'

export const NAV_ITEMS = [
  { to: '/', label: '홈', icon: HomeIcon, end: true },
  { to: '/fridge', label: '냉장고 재료', icon: FridgeIcon },
  { to: '/recipes', label: '레시피 추천', icon: RecipeIcon },
  { to: '/share', label: '냉장고 공유', icon: ShareIcon },
  { to: '/calendar', label: '식단 캘린더', icon: CalendarIcon, soon: true },
  { to: '/shopping', label: '장보기', icon: CartIcon, soon: true },
]

/** 하단 탭바도 실제 동작하는 기능(홈/재료/레시피/공유)은 다 보여주고, 준비중인 2개만 뺀다. */
export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => !item.soon)
