const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY

/** 인가 코드를 발급받을 때/토큰으로 교환할 때 똑같이 써야 하는 redirect_uri.
 * 카카오 디벨로퍼스 콘솔의 "Redirect URI"에 이 경로(도메인별로 하나씩)가 그대로 등록돼 있어야 한다. */
export function getKakaoRedirectUri() {
  return `${window.location.origin}/auth/kakao/callback`
}

/** 카카오 로그인 시작 페이지(인가 코드 요청) URL. */
export function getKakaoAuthorizeUrl() {
  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: getKakaoRedirectUri(),
    response_type: 'code',
  })
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
}
