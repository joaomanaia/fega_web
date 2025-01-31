import { usernameSchema } from "@/lib/schemas/user-schemas"
import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signUpSchema = signInSchema.extend({
  username: usernameSchema,
  fullname: z.string().min(2).max(30).trim(),
})
