"use server"

import { createServerActionClient } from "@/supabase"

const sendGroupMessage = async (groupId: string, message: string) => {
  const supabase = createServerActionClient()

  await supabase.from("group_messages").insert({
    group_id: groupId,
    message: message as string,
  })
}

export default sendGroupMessage
