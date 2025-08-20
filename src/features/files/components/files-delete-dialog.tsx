import { useFiles } from './files-provider'

export function FilesDeleteDialog() {
  const { open, currentRow } = useFiles()

  if (open !== 'delete' || !currentRow) return null

  return <div>文件删除对话框 - 待实现</div>
}
