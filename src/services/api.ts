import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

const STEPFUN_ENDPOINT = import.meta.env.VITE_STEPFUN_ENDPOINT
const STEPFUN_API_KEY = import.meta.env.VITE_STEPFUN_API_KEY

const axiosInstance: AxiosInstance = axios.create({
  baseURL: STEPFUN_ENDPOINT,
  timeout: 10000,
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
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权，清除token并跳转登录
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

// 通用分页响应类型
export interface PaginatedResponse<T> {
  object: 'list'
  data: T[]
  first_id?: string
  last_id?: string
  has_more?: boolean
}
