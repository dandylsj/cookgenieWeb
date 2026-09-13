import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useFridge } from '../../context/FridgeContext'
import Modal from '../Modal'
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
          <select
            className="select topbar-select"
            value={selectedFridgeId ?? ''}
            onChange={(e) => setSelectedFridgeId(Number(e.target.value))}
          >
            {fridges.map((fridge) => (
              <option key={fridge.id} value={fridge.id}>
                {fridge.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="topbar-no-fridge">등록된 냉장고가 없어요</span>
        )}
        <button type="button" className="btn btn-ghost topbar-new-fridge" onClick={() => setCreating(true)}>
          + 냉장고 추가
        </button>
      </div>

      <div className="topbar-user">
        <span className="topbar-nickname">{user?.nickname}님</span>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          로그아웃
        </button>
      </div>

      {creating && (
        <Modal
          title="새 냉장고 만들기"
          onClose={() => setCreating(false)}
          footer={
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setCreating(false)}>
                취소
              </button>
              <button type="submit" form="create-fridge-form" className="btn btn-primary" disabled={submitting}>
                {submitting ? '만드는 중...' : '만들기'}
              </button>
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
