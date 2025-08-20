import { useFiles } from './files-provider'

export function FilesCreateDialog() {
  const { open } = useFiles()

  if (open !== 'create') return null

  return <div>文件创建对话框 - 待实现</div>
}
