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

// 通用API响应类型
export interface PaginatedResponse<T> {
  object: 'list'
  data: T[]
  first_id?: string
  last_id?: string
  has_more?: boolean
}

// export class ApiService {
//   static async get<T>(url: string, params?: unknown): Promise<T> {
//     const response = await axiosInstance.get<ApiResponse<T>>(url, { params })
//     return response.data.data
//   }

//   static async post<T>(url: string, data?: unknown): Promise<T> {
//     const response = await axiosInstance.post<ApiResponse<T>>(url, data)
//     return response.data.data
//   }

//   static async put<T>(url: string, data?: unknown): Promise<T> {
//     const response = await axiosInstance.put<ApiResponse<T>>(url, data)
//     return response.data.data
//   }

//   static async patch<T>(url: string, data?: unknown): Promise<T> {
//     const response = await axiosInstance.patch<ApiResponse<T>>(url, data)
//     return response.data.data
//   }

//   static async delete<T>(url: string): Promise<T> {
//     const response = await axiosInstance.delete<ApiResponse<T>>(url)
//     return response.data.data
//   }
// }
