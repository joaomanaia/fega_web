import { useTheme, Avatar as MuiAvatar } from "@mui/material"

interface AvatarProps {
    name?: string
    photoUrl?: string
}

const Avatar: React.FC<AvatarProps> = ({ name, photoUrl }) => {
  const { palette } = useTheme()

  return (
    <MuiAvatar
      src={photoUrl}
      alt={name}
      aria-label="image"
      sx={{
        background: palette.secondary.main,
        color: palette.onSecondary.main,
      }}
    >
      {name}
    </MuiAvatar>
  )
}

export default Avatar
