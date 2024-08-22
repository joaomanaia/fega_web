"use server"

import { createServerActionClient } from "@/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

const formSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(30, "Full name must be at most 30 characters long"),
  bio: z.string().max(160, "Bio must be at most 160 characters long"),
})

// @deprecated
export default async function saveProfile(formData: FormData) {
  try {
    const parsed = formSchema.parse({
      full_name: formData.get("full_name"),
      bio: formData.get("bio"),
    })

    const supabase = createServerActionClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if user is authenticated
    if (!user) return redirect("/")

    // If the bio is empty, set it to null
    const bio = parsed.bio ? parsed.bio : null

    const { error } = await supabase
      .from("users")
      .update({
        full_name: parsed.full_name,
        bio: bio,
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/edit-profile")

    revalidatePath("/" + user.id)

    return {
      errorMessage: "",
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      if (err.isEmpty) {
        return {
          errorMessage: "Something went wrong",
        }
      }

      const fullNameIssue = err.issues.find((issue) => issue.path[0] === "full_name")

      return {
        fullNameErrorMessage: fullNameIssue?.message ?? "Something went wrong",
      }
    } else if (err instanceof Error) {
      return {
        errorMessage: err.message,
      }
    } else {
      return {
        errorMessage: "Something went wrong",
      }
    }
  }
}
