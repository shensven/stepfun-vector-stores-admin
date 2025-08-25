import { useQueryClient, useIsFetching } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function DataTableRefreshButton() {
  const queryClient = useQueryClient()
  const isFetching = useIsFetching({ queryKey: ['vector_stores'] })

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['vector_stores'] })
  }

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleRefresh}
      className='ms-auto hidden h-8 lg:flex'
    >
      <RefreshCwIcon className={cn('size-4', isFetching && 'animate-spin')} />
      刷新
    </Button>
  )
}
