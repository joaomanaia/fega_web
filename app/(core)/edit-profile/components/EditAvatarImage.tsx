import { Badge, IconButton } from "@mui/material"
import Avatar from "../../components/m3/avatar"
import { EditRounded } from "@mui/icons-material"

interface EditAvatarImageProps {
  avatarImage: string
  name?: string | null
}

export const EditAvatarImage: React.FC<EditAvatarImageProps> = ({ avatarImage, name }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      color="primary"
      badgeContent={<EditAvatarBadge />}
    >
      <Avatar photoUrl={avatarImage} name={name} size={100} />
    </Badge>
  )
}

const EditAvatarBadge: React.FC = () => {
  return (
    <IconButton size="small">
      <EditRounded fontSize="inherit" />
    </IconButton>
  )
}
