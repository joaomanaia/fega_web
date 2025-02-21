"use server"

import { authenticatedProcedure } from "@/lib/actions/zsa-procedures"
import { createGroupSchema } from "@/lib/schemas/group-schemas"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const createGroup = authenticatedProcedure
  .createServerAction()
  .input(createGroupSchema)
  .output(z.string())
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx
    const { group_name, group_avatar } = input

    const { data, error } = await supabase
      .from("groups")
      .insert({
        name: group_name,
        icon_url: group_avatar,
      })
      .select("id")
      .single()

    if (error) {
      throw new Error("Failed to create group", { cause: error })
    }

    if (!data) {
      throw new Error("Failed to create group")
    }

    revalidatePath("/groups")
    revalidatePath("/groups", "layout")

    return data.id
  })
