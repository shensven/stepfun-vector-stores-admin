import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    throw redirect({ to: '/vector-stores' })
  },
})

// import { Dashboard } from '@/features/dashboard'

// export const Route = createFileRoute('/_authenticated/')({
//   component: Dashboard,
// })
