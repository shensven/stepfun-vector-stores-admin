import { type Files } from '@/services/filesAPI'

type FilesTableProps = {
  data: Files[]
}

export function FilesTable({ data }: FilesTableProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>文件列表</h3>
      <div className='text-muted-foreground text-sm'>
        共 {data.length} 个文件
      </div>
      <div className='text-muted-foreground text-sm'>
        文件表格组件 - 待完善实现
      </div>
    </div>
  )
}
