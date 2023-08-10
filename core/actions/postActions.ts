"use server"

import { createServerActionClient } from "@/supabase"
import { isUserAuthenticated } from "@/utils/user-utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

export const createPost = async (description: string) => {
    const supabase = createServerActionClient()

    // Check if users is authenticated
    const userAuthenticated = await isUserAuthenticated()
    if (!userAuthenticated) {
        redirect("/auth")
    }

    await supabase.from("posts").insert({ description })

    revalidateTag("posts")
    revalidatePath("/")
}
