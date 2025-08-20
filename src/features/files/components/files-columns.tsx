import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type StepfunFile } from '@/services/filesAPI'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const filesColumns: ColumnDef<StepfunFile>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px] font-mono text-xs'>{row.getValue('id')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'filename',
    accessorKey: 'filename',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='文件名' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('filename')}
          </span>
        </div>
      )
    },
  },
  {
    id: 'purpose',
    accessorKey: 'purpose',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='用途' />
    ),
    cell: ({ row }) => {
      const purpose = row.getValue('purpose') as string
      const purposeMap = {
        'file-extract': '文件提取',
        'retrieval-text': '文本检索',
        'retrieval-image': '图片检索',
        storage: '存储',
      }
      return (
        <Badge variant='outline'>
          {purposeMap[purpose as keyof typeof purposeMap] || purpose}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variant =
        status === 'success'
          ? 'default'
          : status === 'processed'
            ? 'secondary'
            : 'destructive'
      const statusMap = {
        success: '成功',
        processed: '已处理',
      }
      return (
        <Badge variant={variant}>
          {statusMap[status as keyof typeof statusMap] || status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'bytes',
    accessorKey: 'bytes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='文件大小' />
    ),
    cell: ({ row }) => {
      const bytes = row.getValue('bytes') as number
      const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
      }
      return <div className='text-center'>{formatBytes(bytes)}</div>
    },
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='创建时间' />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue('created_at') as number
      const date = new Date(timestamp * 1000)
      return (
        <div className='text-sm'>{format(date, 'yyyy-MM-dd HH:mm:ss')}</div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
