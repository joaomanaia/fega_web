"use server"

import { authenticatedProcedure } from "@/lib/actions/zsa-procedures"
import { updateEmailSchema } from "@/lib/schemas/user-schemas"

export const updateUserEmail = authenticatedProcedure
  .createServerAction()
  .input(updateEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase, user } = ctx
    const { email } = input

    if (user.email === email) {
      throw new Error("Email is the same as the current email")
    }

    const {
      data: { user: newUser },
      error,
    } = await supabase.auth.updateUser(
      { email },
      {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      }
    )

    if (error) {
      throw new Error("Failed to update email", { cause: error })
    }

    if (!newUser) {
      throw new Error("Failed to update email")
    }

    return newUser
  })
