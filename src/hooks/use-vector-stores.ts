import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  VectorStoresApiService,
  type ParamsListVectorStore,
  type ParamsCreateVectorStore,
  type ParamsAddFiles,
} from '@/services/vectorStoresAPI'
import { toast } from 'sonner'

export function useList(params?: ParamsListVectorStore) {
  return useQuery({
    queryKey: ['vector_stores', params],
    queryFn: () => VectorStoresApiService.getList(params),
    staleTime: 5 * 60 * 1000, // 5分钟内数据保持新鲜
  })
}

export function useCreate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: ParamsCreateVectorStore) =>
      VectorStoresApiService.createItem(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vector_stores'] })
      toast.success(`知识库 "${data.name}" 已成功创建`)
    },
  })
}

export function useDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vectorStoreId: string) =>
      VectorStoresApiService.deleteItem(vectorStoreId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vector_stores'] })
      toast.success(`知识库 "${data.id}" 已成功删除`)
    },
  })
}

export function useListFiles(vectorStoreId: string) {
  return useQuery({
    queryKey: ['vector_stores_files', vectorStoreId],
    queryFn: () => VectorStoresApiService.listFiles(vectorStoreId),
  })
}

export function useRemoveFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      vectorStoreId,
      fileId,
    }: {
      vectorStoreId: string
      fileId: string
    }) => VectorStoresApiService.removeFile(vectorStoreId, fileId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vector_stores_files'] })
      toast.success(`文件 "${data.id}" 已成功删除`)
    },
  })
}

export function useAddFiles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: ParamsAddFiles) =>
      VectorStoresApiService.addFiles(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vector_stores_files'] })
      toast.success(`${data.files.length} 个文件已成功添加到知识库`)
    },
  })
}
