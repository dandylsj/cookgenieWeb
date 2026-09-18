import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | authenticated | guest

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('cookgenie_access_token')
    if (!token) {
      setUser(null)
      setStatus('guest')
      return
    }
    try {
      const profile = await authApi.fetchProfile()
      setUser(profile)
      setStatus('authenticated')
    } catch {
      setUser(null)
      setStatus('guest')
    }
  }, [])

  useEffect(() => {
    loadProfile()
    const onUnauthorized = () => {
      setUser(null)
      setStatus('guest')
    }
    window.addEventListener('cookgenie:unauthorized', onUnauthorized)
    return () => window.removeEventListener('cookgenie:unauthorized', onUnauthorized)
  }, [loadProfile])

  const login = useCallback(async (credentials) => {
    const tokens = await authApi.login(credentials)
    localStorage.setItem('cookgenie_access_token', tokens.accessToken)
    localStorage.setItem('cookgenie_refresh_token', tokens.refreshToken)
    await loadProfile()
  }, [loadProfile])

  const signup = useCallback(async (form) => {
    const tokens = await authApi.signup(form)
    localStorage.setItem('cookgenie_access_token', tokens.accessToken)
    localStorage.setItem('cookgenie_refresh_token', tokens.refreshToken)
    await loadProfile()
  }, [loadProfile])

  const loginWithKakao = useCallback(async (code, redirectUri) => {
    const tokens = await authApi.kakaoLogin(code, redirectUri)
    localStorage.setItem('cookgenie_access_token', tokens.accessToken)
    localStorage.setItem('cookgenie_refresh_token', tokens.refreshToken)
    await loadProfile()
  }, [loadProfile])

  const loginWithGoogle = useCallback(async (code, redirectUri) => {
    const tokens = await authApi.googleLogin(code, redirectUri)
    localStorage.setItem('cookgenie_access_token', tokens.accessToken)
    localStorage.setItem('cookgenie_refresh_token', tokens.refreshToken)
    await loadProfile()
  }, [loadProfile])

  const loginAsGuest = useCallback(async () => {
    const tokens = await authApi.guestLogin()
    localStorage.setItem('cookgenie_access_token', tokens.accessToken)
    localStorage.setItem('cookgenie_refresh_token', tokens.refreshToken)
    await loadProfile()
  }, [loadProfile])

  const upgradeGuest = useCallback(async (form) => {
    const tokens = await authApi.upgradeGuest(form)
    localStorage.setItem('cookgenie_access_token', tokens.accessToken)
    localStorage.setItem('cookgenie_refresh_token', tokens.refreshToken)
    await loadProfile()
  }, [loadProfile])

  const updateNickname = useCallback(async (nickname) => {
    const profile = await authApi.updateNickname(nickname)
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore — we clear local state regardless
    }
    localStorage.removeItem('cookgenie_access_token')
    localStorage.removeItem('cookgenie_refresh_token')
    setUser(null)
    setStatus('guest')
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      signup,
      logout,
      loginAsGuest,
      loginWithKakao,
      loginWithGoogle,
      upgradeGuest,
      updateNickname,
    }),
    [user, status, login, signup, logout, loginAsGuest, loginWithKakao, loginWithGoogle, upgradeGuest, updateNickname]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
