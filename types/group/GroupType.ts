import type { Tables } from "@/types/database.types"


type GroupType = Tables<"groups">

export type GroupViewType = Tables<"group_view">
export type GroupWithLastMessageViewType = Tables<"group_with_last_message_view">

export type GroupParticipantsViewType = Tables<"group_participants_view">

export default GroupType
