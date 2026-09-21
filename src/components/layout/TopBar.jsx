import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFridge } from '../../context/FridgeContext'
import Modal from '../Modal'
import { SettingsIcon } from './icons'
import Button from '../Button'
import Dropdown from '../Dropdown'
import '../../styles/forms.css'
import './TopBar.css'

export default function TopBar() {
  const { user, logout } = useAuth()
  const { fridges, selectedFridgeId, setSelectedFridgeId, createFridge } = useFridge()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(event) {
    event.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await createFridge(newName.trim())
      setNewName('')
      setCreating(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-fridge">
        {fridges.length > 0 ? (
          <Dropdown
            className="topbar-select"
            ariaLabel="냉장고 선택"
            options={fridges.map((fridge) => ({ value: fridge.id, label: fridge.name }))}
            value={selectedFridgeId}
            onChange={setSelectedFridgeId}
          />
        ) : (
          <span className="topbar-no-fridge">등록된 냉장고가 없어요</span>
        )}
        <Button variant="ghost" className="topbar-new-fridge" onClick={() => setCreating(true)}>
          + 냉장고 추가
        </Button>
      </div>

      <div className="topbar-user">
        <span className="topbar-nickname">{user?.nickname}님</span>
        <Link to="/settings" className="btn btn-ghost topbar-settings" aria-label="설정" title="설정">
          <SettingsIcon />
          <span>설정</span>
        </Link>
        <Button variant="ghost" onClick={logout}>
          로그아웃
        </Button>
      </div>

      {creating && (
        <Modal
          title="새 냉장고 만들기"
          onClose={() => setCreating(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setCreating(false)}>
                취소
              </Button>
              <Button type="submit" form="create-fridge-form" disabled={submitting}>
                {submitting ? '만드는 중...' : '만들기'}
              </Button>
            </>
          }
        >
          {error && <div className="form-error">{error}</div>}
          <form id="create-fridge-form" onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="fridge-name">냉장고 이름</label>
              <input
                id="fridge-name"
                className="input"
                placeholder="예: 우리집 냉장고"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </header>
  )
}
