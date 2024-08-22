import { z } from "zod"

export const updateEmailSchema = z
  .object({
    email: z.string().email(),
    confirmEmail: z.string().email(),
  })
  .superRefine(({ email, confirmEmail }, ctx) => {
    if (email !== confirmEmail) {
      ctx.addIssue({
        code: "custom",
        message: "Emails must match",
        path: ["confirmEmail"],
      })
    }
  })

export type UpdateEmailSchemaValues = z.infer<typeof updateEmailSchema>

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(30).trim(),
  bio: z.string().max(160).trim().optional(),
})

export type UpdateProfileSchemaValues = z.infer<typeof updateProfileSchema>
