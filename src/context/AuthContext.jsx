import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

// 이 브라우저에서 한 번이라도 인증(게스트 시작 포함)을 거쳤는지 표시하는 로컬 플래그.
// 처음 방문한 사람만 로그인 화면 없이 바로 게스트로 시작시키고, 그 이후(로그아웃 등으로
// 다시 미인증 상태가 되어도)에는 평소처럼 로그인 화면을 보여주기 위해 필요하다.
const ONBOARDED_KEY = 'cookgenie_onboarded'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | authenticated | guest
  // React StrictMode(개발 모드)는 마운트 이펙트를 두 번 실행한다. 게스트 자동 생성은 네트워크
  // 요청을 동반해서 두 번째 호출이 첫 번째가 끝나기 전에 "아직 토큰 없음"으로 판단해버리면
  // 로그인 화면으로 잘못 보내는 레이스가 생긴다 — 같은 부트스트랩 프로미스를 재사용해서 막는다.
  const bootstrapPromiseRef = useRef(null)

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

  const bootstrap = useCallback(() => {
    if (bootstrapPromiseRef.current) return bootstrapPromiseRef.current
    bootstrapPromiseRef.current = (async () => {
      const hasToken = !!localStorage.getItem('cookgenie_access_token')
      const alreadyOnboarded = !!localStorage.getItem(ONBOARDED_KEY)
      if (!hasToken && !alreadyOnboarded) {
        localStorage.setItem(ONBOARDED_KEY, '1')
        try {
          const tokens = await authApi.guestLogin()
          localStorage.setItem('cookgenie_access_token', tokens.accessToken)
          localStorage.setItem('cookgenie_refresh_token', tokens.refreshToken)
        } catch {
          // 게스트 자동 생성이 실패하면(백엔드 다운 등) 아래 loadProfile이 평소처럼 로그인 화면으로 보낸다.
        }
      }
      await loadProfile()
    })()
    return bootstrapPromiseRef.current
  }, [loadProfile])

  useEffect(() => {
    bootstrap()
    const onUnauthorized = () => {
      setUser(null)
      setStatus('guest')
    }
    window.addEventListener('cookgenie:unauthorized', onUnauthorized)
    return () => window.removeEventListener('cookgenie:unauthorized', onUnauthorized)
  }, [bootstrap])

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
