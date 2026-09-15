import { Outlet } from 'react-router-dom'
import { FridgeProvider } from '../../context/FridgeContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileTabBar from './MobileTabBar'
import GuestBanner from '../GuestBanner'
import './DashboardLayout.css'

export default function DashboardLayout() {
  return (
    <FridgeProvider>
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-main">
          <TopBar />
          <GuestBanner />
          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>
        <MobileTabBar />
      </div>
    </FridgeProvider>
  )
}
