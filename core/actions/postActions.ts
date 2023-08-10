"use server"

import { createServerActionClient } from "@/supabase"
import { revalidatePath, revalidateTag } from "next/cache"

export const createPost = async (description: string) => {
    const supabase = createServerActionClient()

    await supabase.from("posts").insert({ description })

    revalidateTag("posts")
    revalidatePath("/")
}
