import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getKakaoRedirectUri } from '../utils/kakao'
import Button from '../components/Button'
import '../styles/forms.css'
import './AuthLayout.css'

/**
 * 카카오 로그인 인가 코드 콜백 페이지. 카카오 인증 후 이 경로(?code=...)로 리다이렉트되면,
 * 그 코드를 백엔드로 보내 토큰을 받아온다. 인가 코드는 한 번만 쓸 수 있어서 중복 호출을 막아야 한다.
 */
export default function KakaoCallbackPage() {
  const { loginWithKakao } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const requestedRef = useRef(false)

  useEffect(() => {
    if (requestedRef.current) return
    requestedRef.current = true

    const kakaoError = searchParams.get('error')
    if (kakaoError) {
      setError('카카오 로그인이 취소되었어요.')
      return
    }
    const code = searchParams.get('code')
    if (!code) {
      setError('잘못된 접근이에요.')
      return
    }

    loginWithKakao(code, getKakaoRedirectUri())
      .then(() => navigate('/', { replace: true }))
      .catch((err) => setError(err.message))
  }, [searchParams, loginWithKakao, navigate])

  return (
    <div className="auth-page">
      <div className="auth-card">
        {error ? (
          <>
            <div className="form-error">{error}</div>
            <Button
              block
              onClick={() => navigate('/login', { replace: true })}
            >
              로그인으로 돌아가기
            </Button>
          </>
        ) : (
          <p className="auth-subtitle">카카오 로그인 처리 중...</p>
        )}
      </div>
    </div>
  )
}
