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
