import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import '../styles/forms.css'
import './SettingsPage.css'

const NOTIFICATION_STORAGE_KEY = 'cookgenie_notify_expiry_dummy'

function readDummyNotificationSetting() {
  try {
    return localStorage.getItem(NOTIFICATION_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export default function SettingsPage() {
  const { user, updateNickname } = useAuth()

  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [notifyExpiry, setNotifyExpiry] = useState(readDummyNotificationSetting)

  async function handleSaveNickname(event) {
    event.preventDefault()
    if (!nickname.trim()) return
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await updateNickname(nickname.trim())
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancelEdit() {
    setNickname(user?.nickname ?? '')
    setEditing(false)
    setError('')
  }

  // 알림 기능은 아직 서버/네이티브 앱 쪽 구현이 없어서 로컬 저장만 하는 더미 토글이다 - 나중에 앱으로
  // 만들 때 실제 소비기한 알림 기능을 연동하면 됨.
  function handleToggleNotify() {
    const next = !notifyExpiry
    setNotifyExpiry(next)
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, String(next))
    } catch {
      // 로컬 스토리지 접근이 막혀 있어도 화면 상태는 그대로 반영한다.
    }
  }

  return (
    <div className="settings-page">
      <h1 className="settings-title">설정</h1>

      <div className="settings-card">
        <h2 className="settings-card-title">연결된 계정</h2>
        <div className="settings-account-row">
          <div className="settings-account-info">
            {editing ? (
              <form onSubmit={handleSaveNickname} className="settings-nickname-form">
                <input
                  className="input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={50}
                  autoFocus
                  required
                />
                <Button type="submit" disabled={saving}>
                  {saving ? '저장 중...' : '저장'}
                </Button>
                <Button variant="ghost" onClick={handleCancelEdit} disabled={saving}>
                  취소
                </Button>
              </form>
            ) : (
              <div className="settings-nickname-display">
                <span className="settings-nickname-value">{user?.nickname}</span>
                <button
                  type="button"
                  className="settings-edit-btn"
                  onClick={() => setEditing(true)}
                  aria-label="닉네임 변경"
                  title="닉네임 변경"
                >
                  ✎
                </button>
              </div>
            )}
            <span className="settings-account-email">{user?.email}</span>
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        {saved && <div className="settings-saved">닉네임이 변경되었어요!</div>}
      </div>

      <div className="settings-card">
        <h2 className="settings-card-title">일반</h2>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">소비기한 알림</div>
            <div className="settings-row-hint">
              재료 소비기한이 다가오면 알려드려요. (준비 중 — 지금은 화면에만 저장돼요)
            </div>
          </div>
          <button
            type="button"
            className={`settings-switch${notifyExpiry ? ' settings-switch--on' : ''}`}
            role="switch"
            aria-checked={notifyExpiry}
            onClick={handleToggleNotify}
          >
            <span className="settings-switch-knob" />
          </button>
        </div>
      </div>
    </div>
  )
}
