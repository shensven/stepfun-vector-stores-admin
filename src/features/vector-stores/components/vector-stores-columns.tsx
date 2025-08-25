import { type ColumnDef } from '@tanstack/react-table'
import { type VectorStore } from '@/services/vectorStoresAPI'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const vectorStoresColumns: ColumnDef<VectorStore>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => {
      const id = String(row.getValue('id'))
      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(id)
          toast.success('已复制 ID')
        } catch {
          toast.error('复制失败')
        }
      }
      return (
        <div className='flex items-center justify-between gap-1'>
          <div className='truncate font-mono'>{id}</div>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleCopy}
            className='h-6 w-6'
            aria-label='复制ID'
          >
            <Copy opacity={0.7} />
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='名称' />
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(name)
          toast.success('已复制 名称')
        } catch {
          toast.error('复制失败')
        }
      }
      return (
        <div className='flex items-center justify-between'>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='max-w-32 truncate font-medium sm:max-w-sm md:max-w-72'>
                {name}
              </span>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleCopy}
            className='h-6 w-6'
            aria-label='复制名称'
          >
            <Copy opacity={0.7} />
          </Button>
        </div>
      )
    },
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='类型' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return <Badge variant='outline'>{type}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'files',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='文件' />
    ),
    cell: ({ row }) => {
      const c = row.original.file_counts
      return (
        <div className='flex flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-1'>
            <Badge
              variant='outline'
              className='min-w-[2ch] justify-center px-2 text-center'
            >
              总文件数 {c.total}
            </Badge>
            <Badge
              variant='outline'
              className='min-w-[2ch] justify-center border-green-200 px-2 text-center text-green-600'
            >
              已完成 {c.completed}
            </Badge>
          </div>
          <div className='flex flex-wrap items-center gap-1'>
            <Badge
              variant='outline'
              className='min-w-[2ch] justify-center border-amber-200 px-2 text-center text-amber-600'
            >
              进行中 {c.in_progress}
            </Badge>
            <Badge
              variant='outline'
              className={`min-w-[2ch] justify-center px-2 text-center ${c.failed > 0 ? 'border-red-200 text-red-600' : 'text-muted-foreground'}`}
            >
              失败 {c.failed}
            </Badge>
            <Badge
              variant='outline'
              className={`min-w-[2ch] justify-center px-2 text-center ${c.cancelled > 0 ? 'border-orange-200 text-orange-600' : 'text-muted-foreground'}`}
            >
              已取消 {c.cancelled}
            </Badge>
          </div>
        </div>
      )
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
        <div className='font-mono text-sm'>
          {date.toLocaleDateString('zh-CN')}{' '}
          {date.toLocaleTimeString('zh-CN', { hour12: false })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
