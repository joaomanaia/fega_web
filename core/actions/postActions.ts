"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { getTranslations } from "next-intl/server"
import { z } from "zod"
import { ActionError, authActionClient } from "@/lib/safe-action"
import { createPostSchema } from "@/lib/schemas/post-schemas"
import { createClient } from "@/lib/supabase/server"

export const createPost = authActionClient
  .metadata({ actionName: "createPost" })
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    const supabase = await createClient()
    const { data: userCanPost } = await supabase
      .rpc("user_can_post", {
        user_id: ctx.uid,
      })
      .throwOnError()

    if (Boolean(userCanPost) === false) {
      const t = await getTranslations("Post.create")
      throw new ActionError(t("waitTime", { timeSeconds: 60 }))
    }

    await supabase.from("posts").insert({ description: parsedInput.description }).throwOnError()

    revalidateTag("posts")
    revalidatePath("/")
    revalidatePath(`/${ctx.user.user_metadata?.username}`)
  })

export const deletePost = authActionClient
  .metadata({ actionName: "deletePost" })
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const supabase = await createClient()
    await supabase.from("posts").delete().eq("id", parsedInput.id).throwOnError()

    revalidateTag("posts")
    revalidatePath("/")
    revalidatePath(`/${ctx.user.user_metadata?.username}`)
  })
