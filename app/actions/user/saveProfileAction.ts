"use server"

import { createServerActionClient } from "@/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

const schema = z.object({
  full_name: z.string().min(3).max(30),
})

export default async function saveProfile(prevState: any, formData: FormData) {
  try {
    const parsed = schema.parse({
      full_name: formData.get("full_name"),
    })

    const supabase = createServerActionClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if user is authenticated
    if (!user) return redirect("/")

    const { error } = await supabase
      .from("users")
      .update({
        full_name: parsed.full_name,
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/edit-profile")

    return {
      successMessage: "Profile updated successfully",
      fullNameError: "",
      errorMessage: "",
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      if (err.isEmpty) {
        return {
          fullNameError: "",
          successMessage: "",
          errorMessage: "Something went wrong",
        }
      }

      const fullNameIssue = err.issues.find((issue) => issue.path[0] === "full_name")

      return {
        fullNameError: fullNameIssue?.message,
      }
    } else {
      return {
        errorMessage: err,
        fullNameError: "",
        successMessage: "",
      }
    }
  }
}
