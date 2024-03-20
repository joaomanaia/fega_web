"use server"

import { createServerActionClient } from "@/supabase"
import { revalidatePath } from "next/cache"
import * as z from "zod"

export async function deleteMessage(messageId: string) {
  const supabase = createServerActionClient()

  const { error } = await supabase.from("group_messages").delete().eq("id", messageId)

  if (error) {
    return { errorMessage: error.message }
  }
}

const editMessageFormSchema = z.object({
  message: z
    .string()
    .min(1, "Message must be at least 1 character long")
    .max(500, "Message cannot be longer than 500 characters"),
})

export async function editMessage(messageId: string, groupId: string, formData: FormData) {
  try {
    const parsed = editMessageFormSchema.parse({
      message: formData.get("message"),
    })

    const supabase = createServerActionClient()

    const { error } = await supabase
      .from("group_messages")
      .update({ message: parsed.message })
      .eq("id", messageId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/groups/" + groupId)
  } catch (err) {
    if (err instanceof z.ZodError) {
      if (err.isEmpty) {
        return {
          errorMessage: "Something went wrong",
        }
      }

      const messageIssue = err.issues.find((issue) => issue.path[0] === "message")

      return {
        messageErrorMessage: messageIssue?.message ?? "Something went wrong",
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
