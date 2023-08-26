import Avatar from "@/app/(core)/components/m3/avatar"
import UserType from "@/types/UserType"
import { Card, Typography } from "@mui/material"
import { twMerge } from "tailwind-merge"
import GroupMessagePopup from "./popup/GroupMessagePopup"

type GroupMessageProps = {
  message: string
  user: UserType
  byLocalUser: boolean
  hasMessageAbove: boolean
  hasMessageBelow: boolean
}

const GroupMessage: React.FC<GroupMessageProps> = ({
  message,
  user,
  byLocalUser,
  hasMessageAbove,
  hasMessageBelow,
}) => {
  const messageCorners = (): string => {
    if (hasMessageAbove && hasMessageBelow) {
      return byLocalUser ? "rounded-r-md" : "rounded-l-md"
    } else if (hasMessageAbove && !hasMessageBelow) {
      return byLocalUser ? "rounded-tr-md" : "rounded-tl-md"
    } else if (!hasMessageAbove && hasMessageBelow) {
      return byLocalUser ? "rounded-br-md" : "rounded-bl-md"
    } else {
      return ""
    }
  }

  return (
    <div className="flex flex-col space-y-2 w-full">
      {!byLocalUser && !hasMessageAbove && (
        <div className="flex items-center space-x-2">
          <Avatar photoUrl={user?.avatar_url || undefined} name={user?.full_name} size={22} />

          <Typography variant="body1">{user?.full_name}</Typography>
        </div>
      )}

      <div className={twMerge("flex w-full", byLocalUser ? "justify-end" : "justify-start")}>
        <Card
          variant={byLocalUser ? "filled" : "outlined"}
          className={twMerge("p-3 w-fit rounded-2xl", messageCorners())}
        >
          <Typography variant="body1">{message}</Typography>
        </Card>
      </div>
    </div>
  )
}

export default GroupMessage
