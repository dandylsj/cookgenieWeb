import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/forms.css'
import './AuthLayout.css'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ loginId: '', password: '', email: '', nickname: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">CG</span>
          <span className="auth-brand-name">쿡지니 웹</span>
        </div>
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-subtitle">몇 가지 정보만 입력하면 바로 시작할 수 있어요.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="loginId">아이디</label>
            <input
              id="loginId"
              className="input"
              value={form.loginId}
              onChange={updateField('loginId')}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              className="input"
              value={form.nickname}
              onChange={updateField('nickname')}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={updateField('email')}
              autoComplete="email"
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
              onChange={updateField('password')}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-footer">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  )
}
