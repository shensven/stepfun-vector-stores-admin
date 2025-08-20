import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVectorsStore } from './vectors-store-provider'

export function VectorsStorePrimaryButtons() {
  const { setOpen } = useVectorsStore()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>创建</span> <Plus size={18} />
      </Button>
    </div>
  )
}
