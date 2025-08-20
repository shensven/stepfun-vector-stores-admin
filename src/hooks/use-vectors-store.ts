import { useQuery } from '@tanstack/react-query'
import {
  VectorStoresApiService,
  type VectorStoresListParams,
} from '@/services/vectorStoresAPI'

export function useList(params?: VectorStoresListParams) {
  return useQuery({
    queryKey: ['vector_stores', params],
    queryFn: () => VectorStoresApiService.getList(params),
    staleTime: 5 * 60 * 1000, // 5分钟内数据保持新鲜
  })
}
