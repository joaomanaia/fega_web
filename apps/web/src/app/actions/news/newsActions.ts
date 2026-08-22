"use server"

import { getLocale } from "next-intl/server"
import * as z from "zod"
import { redirect } from "@/i18n/navigation"
import { ActionError, authActionClient } from "@/lib/safe-action"

export const createNewsFormSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.url(),
  content: z.string().min(1).max(10000),
})

export type CreateNewsFormValues = z.infer<typeof createNewsFormSchema>

export const createNews = authActionClient
  .metadata({ actionName: "createNews" })
  .inputSchema(createNewsFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx

    const { data, error } = await supabase
      .from("news")
      .insert({
        title: parsedInput.title,
        description: parsedInput.description,
        cover_image: parsedInput.imageUrl,
        content: parsedInput.content,
      })
      .select("id")
      .single()

    if (error || !data) {
      throw new ActionError(error?.message ?? "Failed to create news", { cause: error })
    }

    redirect({ href: `/news/${data.id}`, locale: await getLocale() })
  })

