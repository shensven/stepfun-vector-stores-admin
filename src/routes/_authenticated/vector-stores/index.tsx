import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { VectorStores } from '@/features/vector-stores'

const vectorStoresSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  type: z
    .array(z.enum(['text', 'image']))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/vector-stores/')({
  validateSearch: vectorStoresSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  return <VectorStores />
}
