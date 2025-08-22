import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { SidebarMenuButton } from '@/components/ui/sidebar'

type SiteProps = {
  site?: {
    name: string
    plan: string
    logo: React.ElementType
  }
}

export function Title({ site }: SiteProps) {
  const router = useRouter()

  const handleRefresh = () => {
    router.invalidate()
  }

  return (
    <SidebarMenuButton
      size='lg'
      className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
      onClick={handleRefresh}
    >
      <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
        {site?.logo && <site.logo className='size-4' />}
      </div>
      <div className='grid flex-1 text-start text-sm leading-tight'>
        <span className='truncate font-semibold'>{site?.name}</span>
        <span className='truncate text-xs'>{site?.plan}</span>
      </div>
    </SidebarMenuButton>
  )
}
