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

export type StepfunFileDeleteResponse = {
  id: string
  object: 'file'
  deleted: boolean
}

export type StepfunFileCreateParams = {
  purpose: 'file-extract' | 'retrieval-text' | 'retrieval-image' | 'storage'
  url?: string
  file?: File
}

export type StepfunFileCreateResponse = Omit<StepfunFile, 'status'>

export class FilesApiService {
  private static basePath = '/files'

  static async getList() {
    const { data } = await axiosInstance.get<PaginatedResponse<StepfunFile>>(
      this.basePath
    )
    return data
  }

  static async deleteItem(fileId: string) {
    const { data } = await axiosInstance.delete<StepfunFileDeleteResponse>(
      `${this.basePath}/${fileId}`
    )
    return data
  }

  static async createItem(params: StepfunFileCreateParams) {
    const formData = new FormData()
    formData.append('purpose', params.purpose)

    if (params.url) formData.append('url', params.url)
    if (params.file) formData.append('file', params.file)

    const { data } = await axiosInstance.post<StepfunFileCreateResponse>(
      this.basePath,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data
  }
}
