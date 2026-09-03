import * as z from "zod"

export const createPostSchema = z.object({
  description: z.string().trim().min(1).max(500),
})

export type CreatePostSchemaValues = z.infer<typeof createPostSchema>

export const votePostSchema = z.object({
  voteType: z.enum(["up", "down"]),
})

export type VotePostSchemaValues = z.infer<typeof votePostSchema>
