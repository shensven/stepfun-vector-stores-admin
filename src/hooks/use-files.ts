import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  FilesApiService,
  type FilesListParams,
  type FilesCreateParams,
} from '@/services/filesAPI'
import { toast } from 'sonner'

export function useList(params?: FilesListParams) {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => FilesApiService.getList(params),
    staleTime: 5 * 60 * 1000, // 5分钟内数据保持新鲜
  })
}

export function useCreate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: FilesCreateParams) =>
      FilesApiService.createItem(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success(`文件 "${data.name}" 已成功创建`)
    },
  })
}

export function useDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => FilesApiService.deleteItem(fileId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success(`文件 "${data.id}" 已成功删除`)
    },
  })
}
