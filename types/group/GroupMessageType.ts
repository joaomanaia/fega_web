import type { Tables } from "../database.types"

type GroupMessageType = Tables<"group_messages">

export default GroupMessageType

export type GroupMessageWithUserType = GroupMessageType & {
  user_full_name: string
  user_avatar_url: string
  reply_message?: string
  reply_to_uid?: string
}

export type GroupMessageViewType = Tables<"group_messages_view">
