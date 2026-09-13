import { useState } from 'react'
import { useFridge } from '../context/FridgeContext'
import '../styles/forms.css'
import './EmptyFridgeState.css'

export default function EmptyFridgeState() {
  const { createFridge } = useFridge()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await createFridge(name.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="empty-fridge">
      <div className="empty-fridge-card">
        <h2>아직 등록된 냉장고가 없어요</h2>
        <p>냉장고를 하나 만들면 바로 재료를 등록할 수 있어요.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit} className="empty-fridge-form">
          <input
            className="input"
            placeholder="예: 우리집 냉장고"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '만드는 중...' : '냉장고 만들기'}
          </button>
        </form>
      </div>
    </div>
  )
}
