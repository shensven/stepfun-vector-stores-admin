import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  FilesApiService,
  type StepfunFileCreateParams,
} from '@/services/filesAPI'
import { toast } from 'sonner'

export function useList() {
  return useQuery({
    queryKey: ['files'],
    queryFn: () => FilesApiService.getList(),
    staleTime: 5 * 60 * 1000, // 5分钟内数据保持新鲜
  })
}

export function useCreate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: StepfunFileCreateParams) =>
      FilesApiService.createItem(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success(`文件 "${data.id}" 已成功上传`)
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
