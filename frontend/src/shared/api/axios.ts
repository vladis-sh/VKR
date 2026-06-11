import axios from 'axios'
import { API_URL } from '@/shared/constants'

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: unknown = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

function shouldSkipRefresh(url?: string) {
  if (!url) return false

  return ['/auth/login', '/auth/register', '/auth/refresh'].some((path) =>
    url.includes(path)
  )
}

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      response.data = response.data.data
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined

    // The email-verification grace period is over: the session is still
    // valid (me/resend keep working), but the app must switch to the
    // locked screen. Event instead of a store import to avoid a cycle.
    if (
      error.response?.status === 403 &&
      error.response?.data?.error?.errorCode === 'EMAIL_NOT_VERIFIED'
    ) {
      window.dispatchEvent(new CustomEvent('auth:email-unverified'))
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
        processQueue(null)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Let auth state and router handle the transition to login.
        // Hard reload here causes an infinite loop on public pages because App boots,
        // calls checkAuth again, gets 401 again, and forces another reload.
        window.dispatchEvent(new CustomEvent('auth:logout'))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
