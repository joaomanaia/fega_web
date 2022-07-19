import { Avatar, ListItem, ListItemAvatar, ListItemText, useTheme } from "@mui/material"
import UserType from "./UserType"

type UserComponentType = {
  user: UserType
  onClick: () => void
}

const UserComponent: React.FC<UserComponentType> = ({ user, onClick }) => {
  const { palette } = useTheme()

  return (
    <ListItem onClick={() => onClick()}>
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
    </ListItem>
  )
}

export default UserComponent
