import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLoader from '../components/AppLoader'

export default function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <AppLoader />
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
