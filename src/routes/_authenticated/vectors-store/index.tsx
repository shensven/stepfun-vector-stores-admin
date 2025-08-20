import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { VectorsStore } from '@/features/vectors-store'

const vectorsStoreSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  type: z
    .array(z.enum(['text', 'image']))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/vectors-store/')({
  validateSearch: vectorsStoreSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  return <VectorsStore />
}
