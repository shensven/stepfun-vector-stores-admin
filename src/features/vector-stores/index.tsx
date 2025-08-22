import { useListVectorStores } from '@/hooks/use-vector-stores'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { VectorStoresCreateDialog } from './components/vector-stores-create-dialog'
import { VectorStoresDeleteDialog } from './components/vector-stores-delete-dialog'
import { VectorStoresFilesDrawer } from './components/vector-stores-mutate-drawer'
import { VectorStoresPrimaryButtons } from './components/vector-stores-primary-buttons'
import { VectorStoresProvider } from './components/vector-stores-provider'
import { VectorStoresTable } from './components/vector-stores-table'

function VectorStoresContent() {
  const { data } = useListVectorStores()

  return (
    <>
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
            <h2 className='text-2xl font-bold tracking-tight'>知识库</h2>
            <p className='text-muted-foreground'>管理和浏览您的向量知识库</p>
          </div>
          <VectorStoresPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <VectorStoresTable data={data?.data ?? []} />
        </div>
      </Main>

      <VectorStoresCreateDialog />
      <VectorStoresDeleteDialog />
      <VectorStoresFilesDrawer />
    </>
  )
}

export function VectorStores() {
  return (
    <VectorStoresProvider>
      <VectorStoresContent />
    </VectorStoresProvider>
  )
}
