import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div style={{ padding: 40, textAlign: 'center', color: '#93a29d' }}>불러오는 중...</div>
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
