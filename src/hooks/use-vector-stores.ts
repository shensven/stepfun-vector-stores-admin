import type { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { StepfunError } from '@/services/api'
import type {
  ParamsListVectorStore,
  ParamsCreateVectorStore,
  ParamsAddFiles,
  ResponseCreateVectorStore,
  ResponseDelete,
  ResponseAddFiles,
  ParamsAddFile,
  ParamsRemoveFile,
} from '@/services/vectorStoresAPI'
import { VectorStoresApiService } from '@/services/vectorStoresAPI'
import { toast } from 'sonner'

export function useListVectorStores(params?: ParamsListVectorStore) {
  return useQuery({
    queryKey: ['vector_stores', params],
    queryFn: () => VectorStoresApiService.listVectorStores(params),
    staleTime: 5 * 60 * 1000, // 5分钟内数据保持新鲜
  })
}

export function useCreateVectorStore() {
  const queryClient = useQueryClient()

  return useMutation<
    ResponseCreateVectorStore,
    AxiosError<StepfunError>,
    ParamsCreateVectorStore
  >({
    mutationFn: (params: ParamsCreateVectorStore) => {
      return VectorStoresApiService.createVectorStore(params)
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['vector_stores'] })
      toast.success(`已创建 ${data.name}`)
    },
    onError: (error) => {
      toast.error(error.response?.data.error.message, { richColors: true })
    },
  })
}

export function useDeleteVectorStore() {
  const queryClient = useQueryClient()

  return useMutation<
    ResponseDelete<'vector_store.deleted'>,
    AxiosError<StepfunError>,
    string
  >({
    mutationFn: (vectorStoreId: string) => {
      return VectorStoresApiService.deleteVectorStore(vectorStoreId)
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['vector_stores'] })
      toast.success(`已删除 ${data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data.error.message, { richColors: true })
    },
  })
}

type ListFilesOptions = {
  vectorStoreId: string
  enabled?: boolean
  staleTime?: number
}
export function useListFiles(params: ListFilesOptions) {
  const { vectorStoreId, enabled = true, staleTime = 5 * 60 * 1000 } = params
  return useQuery({
    queryKey: ['vector_stores_files', vectorStoreId],
    queryFn: () => VectorStoresApiService.listFiles(vectorStoreId),
    enabled: enabled && !!vectorStoreId,
    staleTime, // 允许自定义缓存时间
  })
}

export function useRemoveFile() {
  const queryClient = useQueryClient()

  return useMutation<
    ResponseDelete<'vector_store.file.deleted'>,
    AxiosError<StepfunError>,
    ParamsRemoveFile
  >({
    mutationFn: (params: ParamsRemoveFile) => {
      return VectorStoresApiService.removeFile(params)
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['vector_stores_files'] })
      toast.success(`已移除 ${data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data.error.message, { richColors: true })
    },
  })
}

export function useAddFile() {
  const queryClient = useQueryClient()

  return useMutation<ResponseAddFiles, AxiosError<StepfunError>, ParamsAddFile>(
    {
      mutationFn: (params: ParamsAddFile) => {
        return VectorStoresApiService.addFiles({
          vectorStoreId: params.vectorStoreId,
          files: [
            { file_id: params.file.id, description: params.file.description },
          ],
        })
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({
          queryKey: ['vector_stores_files'],
        })
        toast.success(`已添加 ${data.files.at(0)?.metadata.description}`)
      },
      onError: (error) => {
        toast.error(error.response?.data.error.message, { richColors: true })
      },
    }
  )
}

export function useAddFiles() {
  const queryClient = useQueryClient()

  return useMutation<
    ResponseAddFiles,
    AxiosError<StepfunError>,
    ParamsAddFiles
  >({
    mutationFn: (params: ParamsAddFiles) => {
      return VectorStoresApiService.addFiles(params)
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['vector_stores_files'] })
      toast.success(`已添加 ${data.files.length} 个文件`)
    },
    onError: (error) => {
      toast.error(error.response?.data.error.message, { richColors: true })
    },
  })
}
