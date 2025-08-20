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

export class VectorStoresApiService {
  private static basePath = '/vector_stores'

  static async getUsers(
    params?: VectorStoresListParams
  ): Promise<PaginatedResponse<VectorStores>> {
    const { data } = await axiosInstance.get<PaginatedResponse<VectorStores>>(
      this.basePath,
      { params }
    )
    return data
  }
}
