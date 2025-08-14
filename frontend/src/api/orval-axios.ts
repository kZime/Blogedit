// frontend/src/api/orval-axios.ts
// use axios as orval requester
import api from './axios'
export const orvalRequester = <T = unknown>(config: any) => api.request<T>(config)
