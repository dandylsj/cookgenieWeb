const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

/** 인가 코드를 발급받을 때/토큰으로 교환할 때 똑같이 써야 하는 redirect_uri.
 * Google Cloud Console OAuth 클라이언트의 "승인된 리다이렉트 URI"에 이 경로(도메인별로 하나씩)가
 * 그대로 등록돼 있어야 한다. */
export function getGoogleRedirectUri() {
  return `${window.location.origin}/auth/google/callback`
}

/** 구글 로그인 시작 페이지(인가 코드 요청) URL. */
export function getGoogleAuthorizeUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
