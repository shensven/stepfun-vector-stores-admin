import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const vectorStoreListSchema = z.object({
  id: z.string(),
  object: z.string(),
  created_at: z.number(),
  name: z.string(),
  type: z.string(),
})

export type VectorStoreList = z.infer<typeof vectorStoreListSchema>
