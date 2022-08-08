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

        <ListItemText>{user.name}</ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

export default UserComponent
