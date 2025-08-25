import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Loader2Icon, PlusCircleIcon, Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useList as useFilesList } from '@/hooks/use-files'
import {
  useListFiles,
  useRemoveFile,
  useAddFile,
} from '@/hooks/use-vector-stores'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useVectorStores } from './vector-stores-provider'

// 格式化时间
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function VectorStoresFilesDrawer() {
  const { open, setOpen, currentRow, setCurrentRow } = useVectorStores()

  // 当前知识库内的文件
  const { data: filesData } = useListFiles(currentRow?.id || '')
  const includedFiles = filesData?.data || []

  // 所有文件列表（来自 /files）
  const { data: allFilesData } = useFilesList()
  const allFiles = allFilesData?.data || []

  // 本地分页状态
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(allFiles.length / pageSize))
  }, [allFiles.length, pageSize])

  useEffect(() => {
    if (pageIndex > pageCount - 1) {
      setPageIndex(Math.max(0, pageCount - 1))
    }
  }, [pageIndex, pageCount])

  const paginatedFiles = useMemo(() => {
    const start = pageIndex * pageSize
    return allFiles.slice(start, start + pageSize)
  }, [allFiles, pageIndex, pageSize])

  // 删除文件（从当前知识库移除）
  const removeFileMutation = useRemoveFile()

  // 添加文件到知识库
  const addFileMutation = useAddFile()

  const includedIdSet = new Set(includedFiles.map((f) => f.id))

  const handleRemoveFile = async (fileId: string) => {
    if (!currentRow?.id) return
    await removeFileMutation.mutateAsync({
      vectorStoreId: currentRow.id,
      fileId: fileId,
    })
  }

  const handleAddFile = async (fileId: string) => {
    if (!currentRow?.id) return

    // 验证必填字段
    if (!fileId || !fileId.trim()) {
      // file_id 是必填字段，直接返回不执行操作
      return
    }

    // 使用文件名作为描述，确保 description 不为空
    const file = allFiles.find((f) => f.id === fileId)
    const description = file?.filename || '未命名文件'

    await addFileMutation.mutateAsync({
      vectorStoreId: currentRow.id,
      file: { id: fileId, description },
    })
  }

  return (
    <Sheet
      open={open === 'list-files'}
      onOpenChange={(state) => {
        if (!state) {
          setOpen(null)
          setTimeout(() => {
            setCurrentRow(null)
          }, 300)
        }
      }}
    >
      <SheetContent className='sm:max-w-2lg flex w-full max-w-none flex-col md:max-w-4xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl'>
        <SheetHeader className='text-start'>
          <SheetTitle className='truncate pr-8'>{currentRow?.name}</SheetTitle>
          <SheetDescription>查看哪些文件，被添加到了知识库</SheetDescription>
        </SheetHeader>

        <div className='mx-3 flex gap-2'>
          <Badge variant='outline' className='text-xs'>
            {currentRow?.type}
          </Badge>
          <Badge variant='outline' className='text-xs'>
            正在使用 {includedFiles.length}
          </Badge>
        </div>
        <div className='mx-3 mb-2 flex-1 overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>文件名</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className='w-[120px]'>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFiles.length ? (
                paginatedFiles.map((file) => {
                  const included = includedIdSet.has(file.id)
                  const isRemoving =
                    removeFileMutation.isPending &&
                    removeFileMutation.variables?.fileId === file.id
                  const isAdding =
                    addFileMutation.isPending &&
                    addFileMutation.variables?.file?.id === file.id

                  return (
                    <TableRow
                      key={file.id}
                      className={cn(included && 'bg-muted')}
                    >
                      <TableCell>
                        <div className='w-[120px] font-mono text-xs'>
                          {file.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            'max-w-32 truncate font-medium sm:max-w-48 md:max-w-64'
                          }
                        >
                          {file.filename}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className='text-sm'>
                          {formatDate(file.created_at * 1000)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex gap-2'>
                          <Button
                            variant={included ? 'outline' : 'default'}
                            size='sm'
                            onClick={() => handleAddFile(file.id)}
                            disabled={included || isAdding || isRemoving}
                          >
                            {isAdding && (
                              <Loader2Icon className='h-3 w-3 animate-spin' />
                            )}
                            {!isAdding && (
                              <PlusCircleIcon className='h-3 w-3' />
                            )}
                            添加
                          </Button>

                          <Button
                            variant={included ? 'destructive' : 'outline'}
                            size='sm'
                            onClick={() => handleRemoveFile(file.id)}
                            disabled={!included || isRemoving || isAdding}
                          >
                            {isRemoving && (
                              <Loader2Icon className='h-3 w-3 animate-spin' />
                            )}
                            {!isRemoving && <Trash2Icon className='h-3 w-3' />}
                            移除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className='text-center'>
                    暂无文件
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页控件 */}
        <div
          className='mx-3 mb-3 flex items-center justify-between overflow-clip px-2'
          style={{ overflowClipMargin: 1 }}
        >
          <div className='text-muted-foreground hidden flex-1 text-sm sm:block'>
            共 {allFiles.length} 项
          </div>
          <div className='flex items-center sm:space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='hidden text-sm font-medium sm:block'>每页显示</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setPageIndex(0)
                }}
              >
                <SelectTrigger className='h-8 w-[70px]'>
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
              第 {pageIndex + 1} / {pageCount} 页
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => setPageIndex(0)}
                disabled={pageIndex === 0}
              >
                <span className='sr-only'>Go to first page</span>
                <DoubleArrowLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={pageIndex === 0}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() =>
                  setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                }
                disabled={pageIndex >= pageCount - 1}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => setPageIndex(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1}
              >
                <span className='sr-only'>Go to last page</span>
                <DoubleArrowRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
