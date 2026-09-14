import { useState } from 'react'
import Modal from './Modal'
import '../styles/forms.css'

export default function GenerateRecipeModal({ onClose, onGenerate }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setGenerating(true)
    try {
      await onGenerate(note.trim() || undefined)
      onClose()
    } catch (err) {
      setError(err.message)
      setGenerating(false)
    }
  }

  return (
    <Modal
      title="AI 레시피 생성"
      onClose={generating ? undefined : onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={generating}>
            취소
          </button>
          <button type="submit" form="generate-recipe-form" className="btn btn-primary" disabled={generating}>
            {generating ? '만드는 중...' : '레시피 만들기'}
          </button>
        </>
      }
    >
      <p className="form-hint">지금 냉장고에 있는 재료로 AI가 레시피 하나를 만들어줘요.</p>
      {error && <div className="form-error">{error}</div>}
      <form id="generate-recipe-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="recipe-note">추가 요청사항 (선택)</label>
          <textarea
            id="recipe-note"
            className="textarea"
            placeholder="예: 매콤하게 해줘, 15분 안에 되는 걸로"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={generating}
          />
        </div>
      </form>
      {generating && (
        <p className="form-hint">AI가 레시피를 만들고 있어요. 최대 1분 정도 걸릴 수 있어요...</p>
      )}
    </Modal>
  )
}
