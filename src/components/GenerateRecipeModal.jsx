import { useState } from 'react'
import Modal from './Modal'
import RecipeThinkingSteps from './RecipeThinkingSteps'
import '../styles/forms.css'
import './GenerateRecipeModal.css'

export default function GenerateRecipeModal({ onClose, onGenerate }) {
  const [useFridgeIngredients, setUseFridgeIngredients] = useState(true)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setGenerating(true)
    try {
      await onGenerate(note.trim() || undefined, useFridgeIngredients)
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
      <label className="generate-recipe-toggle">
        <input
          type="checkbox"
          checked={useFridgeIngredients}
          onChange={(e) => setUseFridgeIngredients(e.target.checked)}
          disabled={generating}
        />
        <span>냉장고 재료 기준으로 만들기</span>
      </label>
      <p className="form-hint">
        {useFridgeIngredients
          ? '지금 냉장고에 있는 재료로 AI가 레시피 하나를 만들어줘요.'
          : '체크를 해제하면 냉장고에 없는 재료라도 상관없이, 아래 요청 내용만으로 자유롭게 레시피를 만들어줘요.'}
      </p>
      {error && <div className="form-error">{error}</div>}
      <form id="generate-recipe-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="recipe-note">
            {useFridgeIngredients ? '추가 요청사항 (선택)' : '어떤 레시피를 원하세요?'}
          </label>
          <textarea
            id="recipe-note"
            className="textarea"
            placeholder={
              useFridgeIngredients ? '예: 매콤하게 해줘, 15분 안에 되는 걸로' : '예: 김치찌개, 크림파스타 만드는 법'
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={generating}
          />
        </div>
      </form>
      {generating && (
        <>
          <RecipeThinkingSteps />
          <p className="form-hint">최대 1분 정도 걸릴 수 있어요...</p>
        </>
      )}
    </Modal>
  )
}
