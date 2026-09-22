import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Modal from './Modal'
import Button from './Button'
import '../styles/forms.css'

export default function GuestUpgradeModal({ onClose }) {
  const { upgradeGuest } = useAuth()
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
      await upgradeGuest(form)
      onClose()
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="회원가입하고 이어가기"
      onClose={submitting ? undefined : onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            취소
          </Button>
          <Button type="submit" form="guest-upgrade-form" disabled={submitting}>
            {submitting ? '가입 중...' : '가입하고 계속하기'}
          </Button>
        </>
      }
    >
      <p className="form-hint">
        지금까지 만든 냉장고·재료·레시피는 그대로 유지돼요. 로그인 정보만 등록하면 돼요.
      </p>
      {error && <div className="form-error">{error}</div>}
      <form id="guest-upgrade-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="guest-loginId">아이디</label>
          <input
            id="guest-loginId"
            className="input"
            value={form.loginId}
            onChange={updateField('loginId')}
            autoComplete="username"
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="guest-nickname">닉네임</label>
          <input
            id="guest-nickname"
            className="input"
            value={form.nickname}
            onChange={updateField('nickname')}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="guest-email">이메일</label>
          <input
            id="guest-email"
            type="email"
            className="input"
            value={form.email}
            onChange={updateField('email')}
            autoComplete="email"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="guest-password">비밀번호</label>
          <input
            id="guest-password"
            type="password"
            className="input"
            value={form.password}
            onChange={updateField('password')}
            autoComplete="new-password"
            required
          />
        </div>
      </form>
    </Modal>
  )
}
