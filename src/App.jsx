import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import FridgeItemsPage from './pages/FridgeItemsPage'
import RecipesPage from './pages/RecipesPage'
import CalendarPage from './pages/CalendarPage'
import ShoppingPage from './pages/ShoppingPage'
import SharePage from './pages/SharePage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/fridge" element={<FridgeItemsPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/shopping" element={<ShoppingPage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
