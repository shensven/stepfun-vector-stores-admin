import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVectorStores } from './vector-stores-provider'

export function VectorStoresPrimaryButtons() {
  const { setOpen } = useVectorStores()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>创建</span> <Plus size={18} />
      </Button>
    </div>
  )
}
