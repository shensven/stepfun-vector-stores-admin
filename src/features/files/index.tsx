import { useList } from '@/hooks/use-files'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { FilesCreateDialog } from './components/files-create-dialog'
import { FilesDeleteDialog } from './components/files-delete-dialog'
import { FilesPrimaryButtons } from './components/files-primary-buttons'
import { FilesProvider } from './components/files-provider'
import { FilesTable } from './components/files-table'

export function Files() {
  const { data } = useList()

  return (
    <FilesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>文件管理</h2>
            <p className='text-muted-foreground'>管理和浏览您的文件</p>
          </div>
          <FilesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <FilesTable data={data?.data || []} />
        </div>
      </Main>

      <FilesCreateDialog />
      <FilesDeleteDialog />
    </FilesProvider>
  )
}
