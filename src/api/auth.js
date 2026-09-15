import { client } from './client'

export function signup({ loginId, password, email, nickname }) {
  return client.post('/auth/sign', { loginId, password, email, nickname })
}

export function login({ loginId, password }) {
  return client.post('/auth/login', { loginId, password })
}

export function fetchProfile() {
  return client.get('/auth/profile')
}

export function logout() {
  return client.post('/auth/logout')
}

/** 회원가입 없이 바로 시작. 서버에 진짜 계정이 생성되고 토큰이 발급된다 (3일 미전환 시 자동 삭제). */
export function guestLogin() {
  return client.post('/auth/guest')
}

/** 게스트 계정을 정식 회원으로 승격한다. 같은 유저 id를 그대로 쓰므로 냉장고/재료 데이터가 그대로 유지된다. */
export function upgradeGuest({ loginId, password, email, nickname }) {
  return client.post('/auth/guest/upgrade', { loginId, password, email, nickname })
}
