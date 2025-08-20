import axiosInstance from './api'
import type { PaginatedResponse } from './api'

export interface StepfunFile {
  id: string
  object: 'file'
  bytes: number
  created_at: number
  filename: string
  purpose: 'file-extract' | 'retrieval-text' | 'retrieval-image' | 'storage'
  status: 'success' | 'processed'
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

  static async getList() {
    const { data } = await axiosInstance.get<PaginatedResponse<StepfunFile>>(
      this.basePath
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
