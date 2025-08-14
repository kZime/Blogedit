// src/api/axios.ts
import axios from 'axios'
import { getAccessToken, setAccessToken, getRefreshToken } from '../contexts/AuthContext'

const api = axios.create({
  // TODO: use env variable
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
})

const isAuthPath = (url?: string) =>
  !!url && /^\/?api\/(v1\/)?auth\//.test(url)

api.interceptors.request.use((config) => {
  const t = getAccessToken()
  if (t) {
    config.headers = { ...config.headers, Authorization: `Bearer ${t}` }
  }
  return config
})

// ===== 401 refresh: skip auth path; no refresh_token; no hard redirect =====
let isRefreshing = false
let subscribers: Array<(token: string) => void> = []

function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token))
  subscribers = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status
    const config = err?.config || {}

    // not 401 or already retried: pass to upper layer
    if (status !== 401 || config._retry) return Promise.reject(err)

    // auth routes: no auto refresh, pass to upper layer (show error, stay on login page)
    if (isAuthPath(config.url)) {
      // console.log('[axios] 401 on auth endpoint -> skip refresh')
      return Promise.reject(err)
    }

    // non-auth request: try refresh, but must have refresh_token
    const rt = getRefreshToken()
    if (!rt) {
      // console.log('[axios] 401 w/o refreshToken -> skip refresh, clear tokens')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return Promise.reject(err)
    }

    if (!isRefreshing) {
      isRefreshing = true
      try {
        const { data } = await axios.post(
          '/api/auth/refresh',
          { refresh_token: rt },
          { baseURL: api.defaults.baseURL }
        )
        if (!data?.access_token) throw new Error('bad refresh response')

        setAccessToken(data.access_token)
        if (data.refresh_token) {
          localStorage.setItem('refreshToken', data.refresh_token)
        }
        onRefreshed(data.access_token)
      } catch (e) {
        // refresh failed: clear token, pass to upper layer (PrivateRoute will take you back to /login)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    // suspend current request, retry after refresh
    return new Promise((resolve) => {
      subscribers.push((newToken: string) => {
        config.headers = { ...config.headers, Authorization: `Bearer ${newToken}` }
        config._retry = true
        resolve(api(config))
      })
    })
  }
)

export default api
