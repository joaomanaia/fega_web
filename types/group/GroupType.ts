import type { Tables } from "../database.types"

type GroupType = Tables<"groups">

export type GroupViewType = Tables<"group_view">

export type GroupParticipantsViewType = Tables<"group_participants_view">

export default GroupType
