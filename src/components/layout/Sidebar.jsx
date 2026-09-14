import { NavLink } from 'react-router-dom'
import { CalendarIcon, CartIcon, FridgeIcon, HomeIcon, RecipeIcon, ShareIcon } from './icons'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: HomeIcon, end: true },
  { to: '/fridge', label: '냉장고 재료', icon: FridgeIcon },
  { to: '/recipes', label: '레시피 추천', icon: RecipeIcon },
  { to: '/calendar', label: '식단 캘린더', icon: CalendarIcon, soon: true },
  { to: '/shopping', label: '장보기', icon: CartIcon, soon: true },
  { to: '/share', label: '냉장고 공유', icon: ShareIcon, soon: true },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">CG</span>
        <span className="sidebar-brand-name">쿡지니 웹</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, soon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link--active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
            {soon && <span className="sidebar-soon">준비중</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footnote">현재는 냉장고·재료·레시피 기능만 실제 서버와 연동됩니다.</div>
    </aside>
  )
}
