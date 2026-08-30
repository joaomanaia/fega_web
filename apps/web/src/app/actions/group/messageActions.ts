"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"
import { authActionClient, returnAppError } from "@/lib/safe-action"

const deleteMessageSchema = z.object({
  messageId: z.string().min(1),
})

const editMessageSchema = z.object({
  messageId: z.string().min(1),
  groupId: z.string().min(1),
  message: z
    .string()
    .min(1, "Message must be at least 1 character long")
    .max(500, "Message cannot be longer than 500 characters"),
})

export const deleteMessage = authActionClient
  .metadata({ actionName: "deleteMessage" })
  .inputSchema(deleteMessageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, uid } = ctx
    const { messageId } = parsedInput

    const { error } = await supabase
      .from("group_messages")
      .delete()
      .eq("id", messageId)
      .eq("uid", uid)

    if (error) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to delete message" })
    }
  })

export const editMessage = authActionClient
  .metadata({ actionName: "editMessage" })
  .inputSchema(editMessageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, uid } = ctx
    const { messageId, groupId, message } = parsedInput

    const { error } = await supabase
      .from("group_messages")
      .update({ message })
      .eq("id", messageId)
      .eq("uid", uid)

    if (error) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to edit message" })
    }

    revalidatePath("/groups/" + groupId)
  })
