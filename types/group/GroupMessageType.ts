import { Database } from "../database.types"
import { Views } from "../database.types.ext"

type GroupMessageType = Database["public"]["Tables"]["group_messages"]["Row"]

export default GroupMessageType

export type GroupMessageWithUserType = GroupMessageType & {
  user_full_name: string
  user_avatar_url: string
  reply_message?: string
  reply_to_uid?: string
}

export type GroupMessageViewType = Views<"group_messages_view">
