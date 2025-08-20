import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  VectorStoresApiService,
  type VectorStoresListParams,
} from '@/services/vectorStoresAPI'
import { toast } from 'sonner'

export function useList(params?: VectorStoresListParams) {
  return useQuery({
    queryKey: ['vector_stores', params],
    queryFn: () => VectorStoresApiService.getList(params),
    staleTime: 5 * 60 * 1000, // 5分钟内数据保持新鲜
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
