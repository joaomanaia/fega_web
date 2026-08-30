"use server"

import { revalidatePath } from "next/cache"
import { returnValidationErrors } from "next-safe-action"
import { deleteAvatarIfFromUploadthing } from "@/app/api/uploadthing/core"
import { authActionClient, returnAppError } from "@/lib/safe-action"
import { updateEmailSchema, updateProfileSchema } from "@/lib/schemas/user-schemas"

export const updateProfileAction = authActionClient
  .metadata({ actionName: "updateProfile" })
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, uid, user } = ctx
    const { username, full_name, bio, avatar } = parsedInput

    const { error } = await supabase
      .from("users")
      .update({
        username,
        full_name,
        bio,
        avatar_url: avatar,
      })
      .eq("id", uid)

    if (error) {
      if (error?.code === "23505") {
        returnValidationErrors(updateProfileSchema, {
          username: { _errors: ["Username is already taken"] },
        })
      }

      returnAppError({ code: "OPERATION_FAILED", message: "Failed to update profile" })
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
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to update profile" })
    }

    await supabase.auth.refreshSession()
    revalidatePath(username)
    revalidatePath("/", "layout")
  })

export const removeUserAvatar = authActionClient
  .metadata({ actionName: "removeUserAvatar" })
  .action(async ({ ctx }) => {
    const { supabase, uid, user } = ctx

    const { error } = await supabase
      .from("users")
      .update({
        avatar_url: null,
      })
      .eq("id", uid)

    if (error) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to remove avatar" })
    }

    const avatarUrl = user?.user_metadata?.avatar_url
    if (avatarUrl) {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      })

      if (authError) {
        returnAppError({ code: "OPERATION_FAILED", message: "Failed to remove avatar" })
      }

      await deleteAvatarIfFromUploadthing(avatarUrl)
    }

    await supabase.auth.refreshSession()
    revalidatePath(user?.user_metadata?.username ?? "")
    revalidatePath("/", "layout")
  })

export const updateUserEmail = authActionClient
  .metadata({ actionName: "updateUserEmail" })
  .inputSchema(updateEmailSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, user } = ctx
    const { email } = parsedInput

    if (user?.email === email) {
      returnValidationErrors(updateEmailSchema, {
        email: { _errors: ["Email is the same as the current email"] },
      })
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
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to update email" })
    }

    if (!newUser) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to update email" })
    }

    return newUser
  })
