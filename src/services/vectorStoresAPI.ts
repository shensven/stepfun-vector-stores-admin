import axiosInstance from './api'
import type { PaginatedResponse } from './api'

// Vector Store 对象
export interface VectorStore {
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

export interface ParamsListVectorStore {
  limit?: number
  order?: 'asc' | 'desc'
  before?: string
  after?: string
}

export interface ParamsCreateVectorStore {
  name: string
  type: 'text' | 'image'
}

export interface ResponseCreateVectorStore {
  id: string
  name: string
}

export interface ResponseDelete<TObject extends string> {
  id: string
  deleted: boolean
  // object: 'vector_store.deleted'
  object: TObject
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

  static async getList(params?: ParamsListVectorStore) {
    const { data } = await axiosInstance.get<PaginatedResponse<VectorStore>>(
      this.basePath,
      { params }
    )
    return data
  }

  static async deleteItem(vectorStoreId: string) {
    const { data } = await axiosInstance.delete<
      ResponseDelete<'vector_store.deleted'>
    >(`${this.basePath}/${vectorStoreId}`)
    return data
  }

  static async createItem(params: ParamsCreateVectorStore) {
    const { data } = await axiosInstance.post<ResponseCreateVectorStore>(
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

  static async removeFile(vectorStoreId: string, fileId: string) {
    const { data } = await axiosInstance.delete<
      ResponseDelete<'vector_store.file.deleted'>
    >(`${this.basePath}/${vectorStoreId}/files/${fileId}`)
    return data
  }
}
