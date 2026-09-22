import {
  CalendarIcon,
  CartIcon,
  FridgeIcon,
  HomeIcon,
  RecipeIcon,
  SettingsIcon,
  ShareIcon,
} from './icons';

export const NAV_ITEMS = [
  { to: '/', label: '홈', icon: HomeIcon, end: true },
  { to: '/fridge', label: '재료관리', icon: FridgeIcon },
  { to: '/recipes', label: '레시피', icon: RecipeIcon },
  { to: '/share', label: '공유하기', icon: ShareIcon },
  { to: '/shopping', label: '장보기', icon: CartIcon },
  { to: '/calendar', label: '식단관리', icon: CalendarIcon },
  { to: '/settings', label: '설정', icon: SettingsIcon, hideOnMobile: true },
];

/** 하단 탭바는 실제 동작하는 핵심 기능만 보여준다 - 준비중인 항목과 설정(TopBar 아이콘으로 접근)은 뺀다. */
export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter(
  (item) => !item.soon && !item.hideOnMobile,
);
