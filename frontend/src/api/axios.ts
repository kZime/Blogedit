// src/api/axios.ts
import axios from 'axios'
import { getAccessToken, setAccessToken, getRefreshToken } from '../contexts/AuthContext'

const api = axios.create({
  // TODO: use env variable
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
})

const isAuthPath = (url?: string) =>
  !!url && /^\/?api\/(v1\/)?auth\//.test(url)

const authRequestInterceptor = (config: any) => {
  const t = getAccessToken()
  if (t) {
    config.headers = { ...config.headers, Authorization: `Bearer ${t}` }
  }
  return config
}

// Apply to custom instance
api.interceptors.request.use(authRequestInterceptor)

// Also apply to global axios instance (used by orval-generated code)
axios.interceptors.request.use(authRequestInterceptor)

// ===== 401 refresh: skip auth path; no refresh_token; no hard redirect =====
let isRefreshing = false
let subscribers: Array<(token: string) => void> = []

function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token))
  subscribers = []
}

const authResponseInterceptor = async (err: any) => {
  const status = err?.response?.status
  const config = err?.config || {}

  // not 401 or already retried: pass to upper layer
  if (status !== 401 || config._retry) return Promise.reject(err)

  // auth routes: no auto refresh, pass to upper layer
  if (isAuthPath(config.url)) return Promise.reject(err)

  // non-auth request: try refresh, but must have refresh_token
  const rt = getRefreshToken()
  if (!rt) {
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

api.interceptors.response.use((res) => res, authResponseInterceptor)

// Also apply to global axios instance (used by orval-generated code)
axios.interceptors.response.use((res) => res, authResponseInterceptor)

export default api
