import { Box, Card, Typography, useTheme } from "@mui/material"
import useSWR from "swr"
import { fetcher } from "../../utils/data"
import Avatar from "../m3/avatar"
import UserType from "../../types/UserType"

type GroupMessageItemType = {
  text: string
  byLocalUser: boolean
  uid: string
  hasMessageAbove: boolean
  hasMessageBelow: boolean
}

const GroupMessageItem: React.FC<GroupMessageItemType> = ({
  text,
  byLocalUser,
  uid,
  hasMessageAbove,
  hasMessageBelow,
}) => {
  const { data } = useSWR(
    !hasMessageAbove && !byLocalUser ? `/api/user/getUserByUid?uid=${uid}` : null,
    fetcher
  )

  const { palette } = useTheme()

  const user: UserType = data !== undefined ? JSON.parse(data.user) : {}

  const messageCorners = () => {
    if (hasMessageAbove && hasMessageBelow) {
      return `rounded-2xl ${byLocalUser ? "rounded-r-md" : "rounded-l-md"}`
    } else if (hasMessageAbove && !hasMessageBelow) {
      return `rounded-2xl ${byLocalUser ? "rounded-tr-md" : "rounded-tl-md"}`
    } else if (!hasMessageAbove && hasMessageBelow) {
      return `rounded-2xl ${byLocalUser ? "rounded-br-md" : "rounded-bl-md"}`
    } else {
      return "rounded-2xl"
    }
  }

  return (
    <Box className="flex flex-col space-y-2 w-full">
      {!byLocalUser && !hasMessageAbove && (
        <div className="flex items-center space-x-2">
          <Avatar photoUrl={user?.avatar_url} name={user?.full_name} size={22} />

          <Typography variant="body1">{user?.full_name}</Typography>
        </div>
      )}

      <div className={`flex w-full ${byLocalUser ? "justify-end" : "justify-start"}`}>
        <Card
          variant={byLocalUser ? "filled" : "outlined"}
          className={`p-3 w-fit ${messageCorners()}`}
          sx={{
            bgcolor: byLocalUser ? palette.primary.main : palette.surfaceVariant.main,
            color: byLocalUser ? palette.onPrimary.main : palette.onSurfaceVariant.main,
          }}
        >
          <Typography variant="body1">{text}</Typography>
        </Card>
      </div>
    </Box>
  )
}

export default GroupMessageItem
