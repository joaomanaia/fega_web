import { z } from "zod"

export const createGroupSchema = z.object({
  group_name: z.string().min(1).max(50),
  group_avatar: z.url().optional().or(z.literal("")),
})

export type CreateGroupSchemaValues = z.infer<typeof createGroupSchema>
