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
