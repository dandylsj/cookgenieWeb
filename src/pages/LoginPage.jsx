import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getKakaoAuthorizeUrl } from '../utils/kakao'
import { getGoogleAuthorizeUrl } from '../utils/google'
import { KakaoIcon, GoogleIcon } from '../components/AuthProviderIcons'
import '../styles/forms.css'
import './AuthLayout.css'

const FEATURES = [
  { icon: '🧊', label: '냉장고 재료 관리' },
  { icon: '🤖', label: 'AI 레시피 추천' },
  { icon: '📸', label: '사진으로 재료 등록' },
]

export default function LoginPage() {
  const { login, loginAsGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ loginId: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleKakaoLogin() {
    window.location.href = getKakaoAuthorizeUrl()
  }

  function handleGoogleLogin() {
    window.location.href = getGoogleAuthorizeUrl()
  }

  async function handleGuest() {
    setError('')
    setGuestLoading(true)
    try {
      await loginAsGuest()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setGuestLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">CG</span>
          <span className="auth-brand-name">쿡지니</span>
        </div>

        <h1 className="auth-hero-title">냉장고 재료로 뭘 만들지 고민될 때</h1>
        <p className="auth-hero-subtitle">
          재료를 등록하면 AI가 레시피를 추천하고, 유통기한도 놓치지 않게 챙겨드려요.
        </p>

        <ul className="auth-features">
          {FEATURES.map((f) => (
            <li key={f.label}>
              <span className="auth-feature-icon">{f.icon}</span>
              {f.label}
            </li>
          ))}
        </ul>

        {error && <div className="form-error">{error}</div>}

        <button
          type="button"
          className="btn btn-primary btn-block auth-guest-cta"
          onClick={handleGuest}
          disabled={guestLoading}
        >
          {guestLoading ? '시작하는 중...' : '가입 없이 게스트로 시작하기'}
        </button>
        <p className="auth-guest-hint">회원가입 없이 지금 바로 모든 기능을 체험해볼 수 있어요</p>

        <button
          type="button"
          className="auth-login-toggle"
          onClick={() => setShowLogin((v) => !v)}
          aria-expanded={showLogin}
        >
          이미 계정이 있으신가요? <strong>로그인</strong>
          <span className={`auth-login-toggle-caret${showLogin ? ' auth-login-toggle-caret--open' : ''}`}>
            ⌄
          </span>
        </button>

        {showLogin && (
          <div className="auth-login-panel">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="loginId">아이디</label>
                <input
                  id="loginId"
                  className="input"
                  value={form.loginId}
                  onChange={(e) => setForm({ ...form, loginId: e.target.value })}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">비밀번호</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="auth-divider">
              <span>또는</span>
            </div>

            <button type="button" className="btn btn-kakao btn-block btn-social" onClick={handleKakaoLogin}>
              <KakaoIcon />
              <span>카카오로 로그인</span>
            </button>

            <button type="button" className="btn btn-google btn-block btn-social" onClick={handleGoogleLogin}>
              <GoogleIcon />
              <span>구글로 로그인</span>
            </button>

            <p className="auth-footer">
              아직 계정이 없나요? <Link to="/signup">회원가입</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
