import { useList } from '@/hooks/use-vectors-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { VectorsStoreDialogs } from './components/vectors-store-dialogs'
import { VectorsStorePrimaryButtons } from './components/vectors-store-primary-buttons'
import { VectorsStoreProvider } from './components/vectors-store-provider'
import { VectorsStoreTable } from './components/vectors-store-table'

export function VectorsStore() {
  const { data } = useList()

  return (
    <VectorsStoreProvider>
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
          <VectorsStorePrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <VectorsStoreTable data={data?.data || []} />
        </div>
      </Main>

      <VectorsStoreDialogs />
    </VectorsStoreProvider>
  )
}
