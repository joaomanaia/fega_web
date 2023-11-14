"use client"

import { useTheme, Avatar as MuiAvatar } from "@mui/material"

interface AvatarProps {
  name?: string | null
  photoUrl?: string | null
  size?: number
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ name, photoUrl, size, className }) => {
  const { palette } = useTheme()

  return (
    <MuiAvatar
      src={photoUrl ?? undefined}
      alt={name ?? undefined}
      aria-label="image"
      sx={{
        background: palette.secondary.main,
        color: palette.onSecondary.main,
        width: size,
        height: size,
      }}
      className={className}
    >
      {name}
    </MuiAvatar>
  )
}

export default Avatar
