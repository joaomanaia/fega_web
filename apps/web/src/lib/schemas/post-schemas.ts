import * as z from "zod"

export const createPostSchema = z.object({
  description: z.string().min(1).max(500),
})

export type CreatePostSchemaValues = z.infer<typeof createPostSchema>
