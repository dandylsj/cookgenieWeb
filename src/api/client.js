import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const client = axios.create({
  baseURL: BASE_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('cookgenie_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    const body = response.data
    // Backend wraps every payload as GlobalResponse<T> = { success, data, message }
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        return Promise.reject(new Error(body.message || '요청 처리 중 오류가 발생했습니다.'))
      }
      return body.data
    }
    return body
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '네트워크 오류가 발생했습니다.'
    if (error.response?.status === 401) {
      localStorage.removeItem('cookgenie_access_token')
      localStorage.removeItem('cookgenie_refresh_token')
      window.dispatchEvent(new Event('cookgenie:unauthorized'))
    }
    return Promise.reject(new Error(message))
  }
)
