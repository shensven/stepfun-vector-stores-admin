import React, { useState } from 'react'
import { type VectorStores } from '@/services/vectorStoresAPI'
import useDialogState from '@/hooks/use-dialog-state'

type VectorsStoreDialogType = 'create' | 'delete'

type VectorsStoreContextType = {
  open: VectorsStoreDialogType | null
  setOpen: (str: VectorsStoreDialogType | null) => void
  currentRow: VectorStores | null
  setCurrentRow: React.Dispatch<React.SetStateAction<VectorStores | null>>
}

const VectorsStoreContext = React.createContext<VectorsStoreContextType | null>(
  null
)

export function VectorsStoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<VectorsStoreDialogType>(null)
  const [currentRow, setCurrentRow] = useState<VectorStores | null>(null)

  return (
    <VectorsStoreContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VectorsStoreContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useVectorsStore = () => {
  const vectorsStoreContext = React.useContext(VectorsStoreContext)

  if (!vectorsStoreContext) {
    throw new Error(
      'useVectorsStore has to be used within <VectorsStoreContext>'
    )
  }

  return vectorsStoreContext
}
