"use server"

import { createServerActionClient } from "@/supabase"
import { redirect } from "next/navigation"
import { z } from "zod"

const createNewsFormSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url(),
  content: z.string().min(1).max(10000),
})

export async function createNews(formData: FormData) {
  const parsed = createNewsFormSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    content: formData.get("content"),
  })

  const supabase = createServerActionClient()

  const { data, error } = await supabase
    .from("news")
    .insert({
      title: parsed.title,
      description: parsed.description,
      cover_image: parsed.imageUrl,
      content: parsed.content,
    })
    .select("id")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  redirect(`/news/${data.id}`)
}
