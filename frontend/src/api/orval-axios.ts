// frontend/src/api/orval-axios.ts
// use axios as orval requester
import type { AxiosRequestConfig } from 'axios'
import api from './axios'
export const orvalRequester = <T = unknown>(config: AxiosRequestConfig) =>
  api.request<T>(config)
