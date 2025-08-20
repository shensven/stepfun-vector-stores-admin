import { showSubmittedData } from '@/utils/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { VectorsStoreMutateDrawer } from './vectors-store-mutate-drawer'
import { useVectorsStore } from './vectors-store-provider'

export function VectorsStoreDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVectorsStore()
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
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(currentRow, '以下知识库已被删除:')
            }}
            className='max-w-md'
            title={`删除知识库: ${currentRow.name} ?`}
            desc={
              <>
                您即将删除知识库 <strong>{currentRow.name}</strong>. <br />
                此操作无法撤销。
              </>
            }
            confirmText='删除'
          />
        </>
      )}
    </>
  )
}
