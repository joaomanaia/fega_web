"use server"

import { createClient } from "@/lib/supabase/server"

const sendGroupMessage = async (groupId: string, message: string, replyToId?: string) => {
  const supabase = await createClient()

  await supabase.from("group_messages").insert({
    group_id: groupId,
    message: message as string,
    reply_to: replyToId,
  })
}

export default sendGroupMessage
