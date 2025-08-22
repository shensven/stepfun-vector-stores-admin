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

export interface VectorStoresCreateParams {
  name: string
  type: 'text' | 'image'
}

export interface VectorStoresCreateResponse {
  id: string
  name: string
}

// Vector Store File 对象
export interface VectorStoreFile {
  id: string
  object: string
  created_at: number
  vector_store_id: string
  metadata: {
    description: string
    file_name: string
  }
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

  static async createItem(params: VectorStoresCreateParams) {
    const { data } = await axiosInstance.post<VectorStoresCreateResponse>(
      this.basePath,
      params
    )
    return data
  }

  static async listFiles(vectorStoreId: string) {
    const { data } = await axiosInstance.get<
      PaginatedResponse<VectorStoreFile>
    >(`${this.basePath}/${vectorStoreId}/files`)
    return data
  }
}
