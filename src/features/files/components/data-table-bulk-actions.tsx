import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import type { StepfunFile } from '@/services/filesAPI'
import { Trash2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/utils/sleep'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedFiles = selectedRows.map((row) => row.original as StepfunFile)
    toast.promise(sleep(2000), {
      loading: '导出文件...',
      success: () => {
        table.resetRowSelection()
        return `已导出 ${selectedFiles.length} 个文件到 CSV`
      },
      error: '导出失败',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='文件'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='导出文件'
              title='导出文件'
            >
              <Download />
              <span className='sr-only'>导出文件</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>导出文件</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='删除选中的文件'
              title='删除选中的文件'
            >
              <Trash2 />
              <span className='sr-only'>删除选中的文件</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>删除选中的文件</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {/* TODO: 实现批量删除对话框 */}
      {showDeleteConfirm && <div>批量删除功能待实现</div>}
    </>
  )
}
