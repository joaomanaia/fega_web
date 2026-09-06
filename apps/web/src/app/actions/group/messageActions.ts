"use server"

import * as z from "zod"
import { authActionClient, returnAppError } from "@/lib/safe-action"

const deleteMessageSchema = z.object({
  messageId: z.uuid(),
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

const editMessageSchema = z.object({
  message: z.string().trim().min(1).max(500),
})

export const editMessage = authActionClient
  .metadata({ actionName: "editMessage" })
  .inputSchema(editMessageSchema)
  .bindArgsSchemas<[messageId: z.ZodUUID]>([z.uuid()])
  .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [messageId] }) => {
    const { supabase, uid } = ctx
    const { message } = parsedInput

    const { error } = await supabase
      .from("group_messages")
      .update({ message })
      .eq("id", messageId)
      .eq("uid", uid)

    if (error) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to edit message" })
    }
  })
