import type { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { StepfunError } from '@/services/api'
import {
  FilesApiService,
  type StepfunFileDeleteResponse,
  type StepfunFileCreateParams,
  type StepfunFileCreateResponse,
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

  return useMutation<
    StepfunFileCreateResponse,
    AxiosError<StepfunError>,
    StepfunFileCreateParams
  >({
    mutationFn: (params: StepfunFileCreateParams) => {
      return FilesApiService.createItem(params)
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success(`已上传 ${data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data.error.message, { richColors: true })
    },
  })
}

export function useDelete() {
  const queryClient = useQueryClient()

  return useMutation<
    StepfunFileDeleteResponse,
    AxiosError<StepfunError>,
    string
  >({
    mutationFn: (fileId: string) => FilesApiService.deleteItem(fileId),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success(`已删除 ${data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data.error.message, { richColors: true })
    },
  })
}
