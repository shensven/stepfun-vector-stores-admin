import axiosInstance from './api'
import type { PaginatedResponse } from './api'

export interface VectorStoresListParams {
  limit?: number
  order?: 'asc' | 'desc'
  before?: string
  after?: string
}

export interface VectorStores {
  id: string
  object: 'vector_store'
  created_at: number
  name: string
  type: 'text' | 'image'
  file_counts: {
    in_progress: number
    completed: number
    failed: number
    cancelled: number
    total: number
  }
}

export interface VectorStoresDeleteResponse {
  id: string
  object: 'vector_store'
  deleted: boolean
}

export class VectorStoresApiService {
  private static basePath = '/vector_stores'

  static async getList(params?: VectorStoresListParams) {
    const { data } = await axiosInstance.get<PaginatedResponse<VectorStores>>(
      this.basePath,
      { params }
    )
    return data
  }

  static async deleteItem(vectorStoreId: string) {
    const { data } = await axiosInstance.delete<VectorStoresDeleteResponse>(
      `${this.basePath}/${vectorStoreId}`
    )
    return data
  }
}
