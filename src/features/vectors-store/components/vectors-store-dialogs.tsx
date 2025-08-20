import { useDelete } from '@/hooks/use-vectors-store'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { VectorsStoreMutateDrawer } from './vectors-store-mutate-drawer'
import { useVectorsStore } from './vectors-store-provider'

export function VectorsStoreDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVectorsStore()
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

  return (
    <>
      <VectorsStoreMutateDrawer
        key='vectors-store-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <VectorsStoreMutateDrawer
            key={`vectors-store-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='vectors-store-delete'
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
            title={`删除知识库: ${currentRow.name} ?`}
            desc={
              <>
                您即将删除知识库 <strong>{currentRow.name}</strong>. <br />
                此操作无法撤销。
              </>
            }
            confirmText={deleteMutation.isPending ? '删除中...' : '删除'}
            disabled={deleteMutation.isPending}
          />
        </>
      )}
    </>
  )
}
