import * as z from "zod"
import { passwordSchema, usernameSchema } from "@/lib/schemas/user-schemas"

export const signInSchema = z.object({
  email: z.email(),
  password: passwordSchema,
})

export type SignInActionValues = z.infer<typeof signInSchema>

export const signUpSchema = signInSchema.extend({
  username: usernameSchema,
  fullname: z.string().min(2).max(30).trim(),
})

export type SignUpActionValues = z.infer<typeof signUpSchema>

export const forgotPasswordSchema = z.object({
  email: z.email(),
})

export type ForgotPasswordActionValues = z.infer<typeof forgotPasswordSchema>
