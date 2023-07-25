import useSWR from "swr"
import { fetcher } from "../../utils/data"
import UserType from "../../types/UserType"
import {
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText
} from "@mui/material"
import Avatar from "../m3/avatar"

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

  return (
    <ListItem disablePadding>
      <ListItemButton 
        selected={selected}
        onClick={() => onClick(user)}>
        <ListItemAvatar>
          <Avatar
            photoUrl={user?.avatar_url}
            name={user?.full_name} />
        </ListItemAvatar>

        <ListItemText primary={user?.full_name} secondary={lastMessage} />
      </ListItemButton>
    </ListItem>
  )
}

export default PrivateMessageUser
