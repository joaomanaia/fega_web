import blockedUsernames from "@/lib/constants/blockedUsernames"
import { z } from "zod"

export const USERNAME_REGEX = /^(?=[a-z0-9._]{3,20}$)(?!.*[_.]{2})[^_.0-9].*[^_.]$/
export const USERNAME_WITH_AT_REGEX =
  /@(?=[a-z0-9._]{3,20})(?!.*[_.]{2})[^_.0-9].*?[^_.](?![a-z0-9._])/

export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(20)
  // 1. Username must be between 3 and 20 characters
  // 2. Username can only contain lowercase letters, numbers, periods, and underscores
  // 3. Username must start with a letter
  // 4. Username cannot end with a period or underscore
  // 5. Username cannot contain consecutive periods or underscores
  // 6. Username cannot be in the list of blocked usernames
  .regex(USERNAME_REGEX, {
    message:
      "Username must be between 3 and 20 characters and can only contain lowercase letters, numbers, periods, and underscore characters",
  })
  .refine((username) => !blockedUsernames.includes(username), {
    message: "Username is reserved",
  })

export const passwordSchema = z.string().min(6)

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
  username: usernameSchema,
  full_name: z.string().min(2).max(30).trim(),
  bio: z.string().max(160).trim().optional(),
  avatar: z.string().trim().url().nullable(),
})

export type UpdateProfileSchemaValues = z.infer<typeof updateProfileSchema>

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match",
      })
    }
  })

export type ResetPasswordSchemaValues = z.infer<typeof resetPasswordSchema>
