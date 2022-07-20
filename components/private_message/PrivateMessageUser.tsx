import useSWR from "swr"
import { fetcher } from "../../utils/data"
import UserType from "../user/UserType"
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material"

type PrivateMessageUserType = {
  uid: string
  lastMessage: string | null
  selected: boolean
  onClick: (user: UserType) => void
}

const PrivateMessageUser: React.FC<PrivateMessageUserType> = ({
  uid,
  lastMessage,
  selected,
  onClick,
}) => {
  const { data } = useSWR(`/api/user/getUserByUid?uid=${uid}`, fetcher)

  const user: UserType = data !== undefined ? JSON.parse(data.user) : {}

  const { palette } = useTheme()

  return (
    <ListItem disablePadding>
      <ListItemButton 
        selected={selected}
        onClick={() => onClick(user)}>
        <ListItemAvatar>
          <Avatar
            src={user?.photoUrl}
            alt={user?.name}
            aria-label="image"
            sx={{
              background: palette.secondary.main,
              color: palette.onSecondary.main,
            }}
          >
            {user?.name}
          </Avatar>
        </ListItemAvatar>

        <ListItemText primary={user?.name} secondary={lastMessage} />
      </ListItemButton>
    </ListItem>
  )
}

export default PrivateMessageUser
