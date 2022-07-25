import { useTheme, Avatar as MuiAvatar } from "@mui/material"

interface AvatarProps {
    name?: string
    photoUrl?: string
    size?: number
}

const Avatar: React.FC<AvatarProps> = ({ name, photoUrl, size }) => {
  const { palette } = useTheme()

  return (
    <MuiAvatar
      src={photoUrl}
      alt={name}
      aria-label="image"
      sx={{
        background: palette.secondary.main,
        color: palette.onSecondary.main,
        width: size,
        height: size
      }}
    >
      {name}
    </MuiAvatar>
  )
}

export default Avatar
