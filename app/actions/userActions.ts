"use server"

import { authenticatedProcedure } from "@/lib/actions/zsa-procedures"
import { updateEmailSchema, updateProfileSchema } from "@/lib/schemas/user-schemas"
import { revalidatePath } from "next/cache"

export const updateUserProfile = authenticatedProcedure
  .createServerAction()
  .input(updateProfileSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase, user } = ctx
    const { full_name, bio } = input

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name,
        bio,
      },
    })

    if (authError) {
      throw new Error("Failed to update profile", { cause: authError })
    }

    const { error } = await supabase
      .from("users")
      .update({
        full_name,
        bio,
      })
      .eq("id", user.id)

    if (error) {
      throw new Error("Failed to update profile", { cause: error })
    }

    revalidatePath(`/user/${user.id}`)
  })

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
