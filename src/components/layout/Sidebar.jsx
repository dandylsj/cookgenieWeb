import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import './Sidebar.css'

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

      <div className="sidebar-footnote">현재는 냉장고·재료·레시피·공유 기능만 실제 서버와 연동됩니다.</div>
    </aside>
  )
}
