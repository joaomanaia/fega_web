import UserType from "../UserType"
import { Database } from "../database.types"

type GroupMessageType = Database["public"]["Tables"]["group_messages"]["Row"]

export default GroupMessageType

export type GroupMessageWithUserType = GroupMessageType & {
    user: UserType
}
