import { useDelete } from '@/hooks/use-vector-stores'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useVectorStores } from './vector-stores-provider'

export function VectorStoresDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useVectorStores()
  const deleteMutation = useDelete()

  const handleDelete = async () => {
    if (!currentRow) return

    try {
      await deleteMutation.mutateAsync(currentRow.id)
      // 删除成功后关闭对话框并清理状态
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 300)
    } catch (_error) {
      // 错误已在 hook 中处理，这里不需要额外处理
    }
  }

  if (!currentRow) return null

  return (
    <ConfirmDialog
      key='vector-stores-delete'
      destructive
      open={open === 'delete'}
      onOpenChange={() => {
        if (deleteMutation.isPending) return // 防止在删除过程中关闭对话框
        setOpen('delete')
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      }}
      handleConfirm={handleDelete}
      className='max-w-md'
      title={`删除知识库 ${currentRow.name}`}
      desc='此操作无法撤销！'
      confirmText={deleteMutation.isPending ? '删除中...' : '删除'}
      disabled={deleteMutation.isPending}
    />
  )
}
