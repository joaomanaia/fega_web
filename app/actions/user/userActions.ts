"use server"

import { authenticatedProcedure } from "@/lib/actions/zsa-procedures"
import { updateProfileSchema } from "@/lib/schemas/user-schemas"
import { revalidatePath } from "next/cache"

export const updateUserProfile = authenticatedProcedure
  .createServerAction()
  .input(updateProfileSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase, user } = ctx
    const { full_name, bio } = input

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
