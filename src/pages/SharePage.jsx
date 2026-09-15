import { useState } from 'react'
import { useFridge } from '../context/FridgeContext'
import * as fridgeApi from '../api/fridge'
import '../styles/forms.css'
import './SharePage.css'

export default function SharePage() {
  const { fridges, selectedFridge, joinFridge } = useFridge()

  const [inviteCode, setInviteCode] = useState(null)
  const [expiryDate, setExpiryDate] = useState(null)
  const [issuing, setIssuing] = useState(false)
  const [issueError, setIssueError] = useState('')
  const [copied, setCopied] = useState(false)

  const [joinCode, setJoinCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [joinSuccess, setJoinSuccess] = useState('')

  const isOwner = selectedFridge?.myRole === 'OWNER'

  async function handleIssueCode() {
    if (!selectedFridge) return
    setIssuing(true)
    setIssueError('')
    setCopied(false)
    try {
      const result = await fridgeApi.createInviteCode(selectedFridge.id)
      setInviteCode(result.inviteCode)
      setExpiryDate(result.expiryDate)
    } catch (err) {
      setIssueError(err.message)
    } finally {
      setIssuing(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 클립보드 접근이 막혀 있으면 그냥 무시 — 코드가 화면에 이미 보이니 직접 복사하면 된다.
    }
  }

  async function handleJoin(event) {
    event.preventDefault()
    setJoining(true)
    setJoinError('')
    setJoinSuccess('')
    try {
      const fridge = await joinFridge(joinCode.trim())
      setJoinSuccess(`'${fridge.name}' 냉장고에 참여했어요!`)
      setJoinCode('')
    } catch (err) {
      setJoinError(err.message)
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="share-page">
      <div className="share-header">
        <h1>냉장고 공유</h1>
        <p>초대코드로 가족이나 룸메이트와 냉장고를 함께 관리해요.</p>
      </div>

      <div className="share-card">
        <h2 className="share-card-title">초대코드 만들기</h2>
        {!selectedFridge ? (
          <p className="form-hint">초대코드를 만들려면 먼저 냉장고를 선택하거나 만들어주세요.</p>
        ) : !isOwner ? (
          <p className="form-hint">
            '{selectedFridge.name}'의 소유자만 초대코드를 만들 수 있어요. (내 역할: 멤버)
          </p>
        ) : (
          <>
            <p className="form-hint">
              '{selectedFridge.name}'에 참여할 수 있는 4자리 코드를 만들어요. 7일간 유효하고, 새로
              발급하면 이전 코드는 바로 무효화돼요.
            </p>
            {issueError && <div className="form-error">{issueError}</div>}
            {inviteCode && (
              <div className="invite-code-display">
                <span className="invite-code-value">{inviteCode}</span>
                <button type="button" className="btn btn-ghost" onClick={handleCopy}>
                  {copied ? '복사됨!' : '복사하기'}
                </button>
                <span className="invite-code-expiry">
                  {new Date(expiryDate).toLocaleDateString('ko-KR')}까지 유효
                </span>
              </div>
            )}
            <button type="button" className="btn btn-primary" onClick={handleIssueCode} disabled={issuing}>
              {issuing ? '만드는 중...' : inviteCode ? '새 코드로 재발급' : '초대코드 발급'}
            </button>
          </>
        )}
      </div>

      <div className="share-card">
        <h2 className="share-card-title">초대코드로 참여하기</h2>
        <p className="form-hint">상대방에게 받은 4자리 코드를 입력하면 그 냉장고의 멤버로 참여해요.</p>
        {joinError && <div className="form-error">{joinError}</div>}
        {joinSuccess && <div className="share-success">{joinSuccess}</div>}
        <form onSubmit={handleJoin} className="join-form">
          <input
            className="input join-form-input"
            placeholder="1234"
            inputMode="numeric"
            maxLength={4}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={joining || joinCode.length !== 4}>
            {joining ? '참여하는 중...' : '참여하기'}
          </button>
        </form>
      </div>

      <p className="share-note">
        지금 {fridges.length}개의 냉장고에 속해 있어요. 참여 중인 멤버 목록 보기·내보내기 기능은 아직
        준비 중이에요.
      </p>
    </div>
  )
}
