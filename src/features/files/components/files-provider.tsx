import React, { useState } from 'react'
import { type StepfunFile } from '@/services/files-api'
import useDialogState from '@/hooks/use-dialog-state'

type FilesDialogType = 'create' | 'delete' | 'batch-upload'

type FilesContextType = {
  open: FilesDialogType | null
  setOpen: (str: FilesDialogType | null) => void
  currentRow: StepfunFile | null
  setCurrentRow: React.Dispatch<React.SetStateAction<StepfunFile | null>>
}

const FilesContext = React.createContext<FilesContextType | null>(null)

export function FilesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<FilesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<StepfunFile | null>(null)

  return (
    <FilesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </FilesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFiles = () => {
  const filesContext = React.useContext(FilesContext)

  if (!filesContext) {
    throw new Error('useFiles has to be used within <FilesContext>')
  }

  return filesContext
}
