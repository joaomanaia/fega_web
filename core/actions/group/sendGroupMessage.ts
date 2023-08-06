"use server"

import { Database } from "@/types/database.types"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const sendGroupMessage = async (groupId: string, message: string) => {
  const supabase = createServerActionClient<Database>({ cookies })

  await supabase.from("group_messages").insert({
    group_id: groupId,
    message: message as string,
  })
}

export default sendGroupMessage
