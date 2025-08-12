"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { authenticatedProcedure } from "@/lib/actions/zsa-procedures"
import { createPostSchema } from "@/lib/schemas/post-schemas"

export const createPost = authenticatedProcedure
  .createServerAction()
  .input(createPostSchema)
  .handler(async ({ input, ctx }) => {
    const { description } = input

    const { error } = await ctx.supabase.from("posts").insert({ description })

    if (error) {
      throw Error("Failed to create post")
    }

    revalidateTag("posts")
    revalidatePath("/")
    revalidatePath(`/${ctx.user.user_metadata?.username}`)
  })

export const deletePost = authenticatedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, ctx }) => {
    const { error } = await ctx.supabase.from("posts").delete().eq("id", input.id)

    if (error) {
      throw Error("Failed to delete post")
    }

    revalidateTag("posts")
    revalidatePath("/")
    revalidatePath(`/${ctx.user.user_metadata?.username}`)
  })
