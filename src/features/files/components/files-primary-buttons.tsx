import { Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFiles } from './files-provider'

export function FilesPrimaryButtons() {
  const { setOpen } = useFiles()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('batch-upload')}
      >
        <span>批量上传</span> <Upload size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>上传文件</span> <Plus size={18} />
      </Button>
    </div>
  )
}
