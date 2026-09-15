import { NavLink } from 'react-router-dom'
import { MOBILE_NAV_ITEMS } from './navItems'
import './MobileTabBar.css'

export default function MobileTabBar() {
  return (
    <nav className="mobile-tabbar">
      {MOBILE_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `mobile-tab${isActive ? ' mobile-tab--active' : ''}`}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
