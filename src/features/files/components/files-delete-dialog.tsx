import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { useDelete } from '@/hooks/use-files'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useFiles } from './files-provider'

export function FilesDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useFiles()
  const deleteMutation = useDelete()

  const handleDelete = async () => {
    if (!currentRow) return
    await deleteMutation.mutateAsync(currentRow.id)
    // 删除成功后关闭对话框并清理状态
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 300)
  }

  if (!currentRow) return null

  return (
    <ConfirmDialog
      key='files-delete'
      destructive
      open={open === 'delete'}
      onOpenChange={(state) => {
        if (deleteMutation.isPending) return // 防止在删除过程中关闭对话框
        setOpen(state ? 'delete' : null)
        if (!state) {
          setTimeout(() => {
            setCurrentRow(null)
          }, 300)
        }
      }}
      handleConfirm={handleDelete}
      className='max-w-md'
      title={`删除文件 ${currentRow.filename}`}
      desc='此操作无法撤销！'
      cancelBtnText='取消'
      confirmText={
        <>
          {!deleteMutation.isPending && <Trash2Icon />}
          {deleteMutation.isPending && <Loader2Icon className='animate-spin' />}
          删除
        </>
      }
      disabled={deleteMutation.isPending}
    />
  )
}
