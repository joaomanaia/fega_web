"use server"

import { deleteAvatarIfFromUploadthing } from "@/app/api/uploadthing/core"
import { authenticatedProcedure } from "@/lib/actions/zsa-procedures"
import { updateEmailSchema, updateProfileSchema } from "@/lib/schemas/user-schemas"
import { revalidatePath } from "next/cache"
import { ZSAError } from "zsa"

export const updateProfileAction = authenticatedProcedure
  .createServerAction()
  .input(updateProfileSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase, user } = ctx
    const { username, full_name, bio, avatar } = input

    const { error } = await supabase
      .from("users")
      .update({
        username,
        full_name,
        bio,
        avatar_url: avatar,
      })
      .eq("id", user.id)

    if (error) {
      // Unique constraint violation
      if (error?.code === "23505") {
        throw new ZSAError("CONFLICT", "Username is already taken")
      }

      throw new Error("Failed to update profile", { cause: error })
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        username,
        full_name,
        bio,
        avatar_url: avatar,
      },
    })

    if (authError) {
      throw new Error("Failed to update profile", { cause: authError })
    }

    await supabase.auth.refreshSession()
    revalidatePath(username)
    revalidatePath("/", "layout")
  })

export const removeUserAvatar = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { supabase, user } = ctx

    const { error } = await supabase
      .from("users")
      .update({
        avatar_url: null,
      })
      .eq("id", user.id)

    if (error) {
      throw new Error("Failed to remove avatar", { cause: error })
    }

    const avatarUrl = user.user_metadata.avatar_url
    if (avatarUrl) {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      })

      if (authError) {
        throw new Error("Failed to remove avatar", { cause: authError })
      }

      await deleteAvatarIfFromUploadthing(avatarUrl)
    }

    await supabase.auth.refreshSession()
    revalidatePath(user.user_metadata?.username)
    revalidatePath("/", "layout")
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
