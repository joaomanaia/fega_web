import { Tables, Views } from "@/types/database.types.ext"

type GroupType = Tables<"groups">

export type GroupViewType = Views<"group_view">

export type GroupParticipantsViewType = Views<"group_participants_view">

export default GroupType
