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

export interface ParamsAddFiles {
  vectorStoreId: string
  files: Array<{
    file_id: string
    description: string
  }>
}
export interface ResponseAddFiles {
  files: Array<{
    file_id: string
    metadata: { description: string }
  }>
}

export class VectorStoresApiService {
  private static basePath = '/vector_stores'

  // 操作知识库

  /**
   * 查看知识库列表
   * @param ParamsListVectorStore 参数
   * @returns 知识库列表
   */
  static async listVectorStores(params?: ParamsListVectorStore) {
    const { data } = await axiosInstance.get<PaginatedResponse<VectorStore>>(
      this.basePath,
      { params }
    )
    return data
  }

  /**
   * 删除知识库
   * @param vectorStoreId 知识库 ID
   * @returns 删除结果
   */
  static async deleteVectorStore(vectorStoreId: string) {
    const { data } = await axiosInstance.delete<
      ResponseDelete<'vector_store.deleted'>
    >(`${this.basePath}/${vectorStoreId}`)
    return data
  }

  /**
   * 创建知识库
   * @param ParamsCreateVectorStore 参数
   * @returns 创建结果
   */
  static async createVectorStore(params: ParamsCreateVectorStore) {
    const { data } = await axiosInstance.post<ResponseCreateVectorStore>(
      this.basePath,
      params
    )
    return data
  }

  /**
   * 获取知识库详情
   * @param vectorStoreId 知识库 ID
   * @returns 知识库详情
   */
  static async queryVectorStore(vectorStoreId: string) {
    const { data } = await axiosInstance.get<VectorStore>(
      `${this.basePath}/${vectorStoreId}`
    )
    return data
  }

  /**
   * 查看知识库中的文件列表
   * @param vectorStoreId 知识库 ID
   * @returns 文件列表
   */
  static async listFiles(vectorStoreId: string) {
    const { data } = await axiosInstance.get<
      PaginatedResponse<VectorStoreFile>
    >(`${this.basePath}/${vectorStoreId}/files`)
    return data
  }

  /**
   * 将文件从知识库中移除
   * @param vectorStoreId 知识库 ID
   * @param fileId 文件 ID
   * @returns 移除结果
   */
  static async removeFile(vectorStoreId: string, fileId: string) {
    const { data } = await axiosInstance.delete<
      ResponseDelete<'vector_store.file.deleted'>
    >(`${this.basePath}/${vectorStoreId}/files/${fileId}`)
    return data
  }

  /**
   * 将文件添加到知识库
   * @param ParamsAddFiles 参数
   * @returns 添加结果
   */
  static async addFiles(params: ParamsAddFiles) {
    const { vectorStoreId, files } = params
    const { data } = await axiosInstance.post<ResponseAddFiles>(
      `${this.basePath}/${vectorStoreId}/files`,
      { files }
    )
    return data
  }
}
