import axios from 'axios'
import type { AxiosInstance } from 'axios'

const STEPFUN_ENDPOINT = import.meta.env.VITE_STEPFUN_ENDPOINT
const STEPFUN_API_KEY = import.meta.env.VITE_STEPFUN_API_KEY

const axiosInstance: AxiosInstance = axios.create({
  baseURL: STEPFUN_ENDPOINT,
  // timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (STEPFUN_API_KEY) {
      config.headers.Authorization = `Bearer ${STEPFUN_API_KEY}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
export { axiosInstance }

// 通用分页响应类型
export interface PaginatedResponse<T> {
  object: 'list'
  data: T[]
  first_id?: string
  last_id?: string
  has_more?: boolean
}

// 通用错误
export interface StepfunError {
  error: {
    type: string
    message: string
  }
}
