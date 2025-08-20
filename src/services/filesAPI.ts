import axiosInstance from './api'
import type { PaginatedResponse } from './api'

export interface FilesListParams {
  limit?: number
  order?: 'asc' | 'desc'
  before?: string
  after?: string
  type?: 'document' | 'image' | 'video' | 'audio' | 'other'
}

export interface Files {
  id: string
  object: 'file'
  created_at: number
  name: string
  filename: string
  type: 'document' | 'image' | 'video' | 'audio' | 'other'
  size: number
  mime_type: string
  status: 'uploading' | 'processed' | 'error'
}

export interface FilesDeleteResponse {
  id: string
  object: 'file'
  deleted: boolean
}

export interface FilesCreateParams {
  name: string
  type: 'document' | 'image' | 'video' | 'audio' | 'other'
}

export interface FilesCreateResponse {
  id: string
  name: string
}

export class FilesApiService {
  private static basePath = '/files'

  static async getList(params?: FilesListParams) {
    const { data } = await axiosInstance.get<PaginatedResponse<Files>>(
      this.basePath,
      { params }
    )
    return data
  }

  static async deleteItem(fileId: string) {
    const { data } = await axiosInstance.delete<FilesDeleteResponse>(
      `${this.basePath}/${fileId}`
    )
    return data
  }

  static async createItem(params: FilesCreateParams) {
    const { data } = await axiosInstance.post<FilesCreateResponse>(
      this.basePath,
      params
    )
    return data
  }
}
