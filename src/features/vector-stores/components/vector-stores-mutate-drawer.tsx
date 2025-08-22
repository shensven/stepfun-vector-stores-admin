import { Loader2Icon, MoreHorizontal } from 'lucide-react'
import { useListFiles, useRemoveFile } from '@/hooks/use-vector-stores'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

  // 使用真实的 API 查询文件列表
  const { data: filesData } = useListFiles(currentRow?.id || '')

  // 使用真实的 API 删除文件
  const removeFileMutation = useRemoveFile()

  // 获取文件列表，如果没有数据则使用空数组
  const files = filesData?.data || []

  // 处理文件删除
  const handleRemoveFile = async (fileId: string) => {
    if (!currentRow?.id) return

    try {
      await removeFileMutation.mutateAsync({
        vectorStoreId: currentRow.id,
        fileId: fileId,
      })
    } catch (_error) {
      // 错误已在 hook 中处理
    }
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
      <SheetContent className='flex w-full max-w-none flex-col sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-4xl 2xl:max-w-4xl'>
        <SheetHeader className='text-start'>
          <SheetTitle className='flex items-center gap-2'>
            {currentRow?.name} - 文件列表
          </SheetTitle>
          <SheetDescription>管理和浏览知识库中的文件</SheetDescription>
        </SheetHeader>

        <div className='mx-2 mb-2 flex-1 overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>文件名</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className='w-[80px]'>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length ? (
                files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className='w-[120px] font-mono text-xs'>
                        {file.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <span className='max-w-32 truncate font-medium sm:max-w-48 md:max-w-64'>
                          {file.metadata.file_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-muted-foreground text-sm'>
                        {file.metadata.description || '无描述'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        {formatDate(file.created_at * 1000)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>下载</DropdownMenuItem>
                          <DropdownMenuItem>预览</DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => handleRemoveFile(file.id)}
                            disabled={removeFileMutation.isPending}
                          >
                            {removeFileMutation.isPending && (
                              <Loader2Icon className='animate-spin' />
                            )}
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    暂无文件
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  )
}
