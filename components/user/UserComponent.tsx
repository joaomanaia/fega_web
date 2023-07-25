import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material"
import UserType from "../../types/UserType"

type UserComponentType = {
  user: UserType
  selected?: boolean
  onClick: () => void
}

const UserComponent: React.FC<UserComponentType> = ({ user, selected, onClick }) => {
  const { palette } = useTheme()

  return (
    <ListItem onClick={onClick} disablePadding>
      <ListItemButton selected={selected}>
        <ListItemAvatar>
          <Avatar
            src={user?.avatar_url}
            alt={user?.full_name}
            aria-label="image"
            sx={{
              background: palette.secondary.main,
              color: palette.onSecondary.main,
            }}
          >
            {user?.full_name}
          </Avatar>
        </ListItemAvatar>

        <ListItemText>{user.full_name}</ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

export default UserComponent
