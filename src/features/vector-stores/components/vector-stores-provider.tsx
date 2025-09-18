import React, { useState } from 'react'
import { type VectorStore } from '@/services/vector-stores-api'
import useDialogState from '@/hooks/use-dialog-state'

type VectorStoresDialogType = 'create' | 'delete' | 'list-files'

type VectorStoresContextType = {
  open: VectorStoresDialogType | null
  setOpen: (str: VectorStoresDialogType | null) => void
  currentRow: VectorStore | null
  setCurrentRow: React.Dispatch<React.SetStateAction<VectorStore | null>>
}

const VectorStoresContext = React.createContext<VectorStoresContextType | null>(
  null
)

export function VectorStoresProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<VectorStoresDialogType>(null)
  const [currentRow, setCurrentRow] = useState<VectorStore | null>(null)

  return (
    <VectorStoresContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </VectorStoresContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useVectorStores = () => {
  const vectorStoresContext = React.useContext(VectorStoresContext)

  if (!vectorStoresContext) {
    throw new Error(
      'useVectorStores has to be used within <VectorStoresContext>'
    )
  }

  return vectorStoresContext
}
