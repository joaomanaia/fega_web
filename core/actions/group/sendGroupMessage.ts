"use server"

import { createServerActionClient } from "@/supabase"

const sendGroupMessage = async (groupId: string, message: string, replyToId?: string) => {
  const supabase = createServerActionClient()

  await supabase.from("group_messages").insert({
    group_id: groupId,
    message: message as string,
    reply_to: replyToId,
  })
}

export default sendGroupMessage
