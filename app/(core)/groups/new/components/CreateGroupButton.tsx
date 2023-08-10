"use client"

import { useTheme, SxProps, Paper, Typography, alpha, useMediaQuery } from "@mui/material"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

interface CreateGroupButtonProps {
  className?: string
}

const CreateGroupButton: React.FC<CreateGroupButtonProps> = ({ className }) => {
  const { palette, breakpoints } = useTheme()
  const isSmUp = useMediaQuery(breakpoints.up("md"))
  const isSxUp = useMediaQuery(breakpoints.up("sm"))
  const radius = 25

  const paperStyle: SxProps = {
    p: 2,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
    height: "auto",
    mb: 2,
    mr: 2,
    ml: isSxUp ? (isSmUp ? 0 : 2) : 0,
    backgroundColor: palette.primaryContainer.main,
    ":hover": {
      backgroundColor: alpha(palette.primaryContainer.main, 0.8),
    },
  }

  return (
    <Link
      href="/groups/new"
      className={twMerge("text-inherit bg-inherit decoration-transparent", className)}
    >
      <Paper
        sx={paperStyle}
        elevation={0}
        className="cursor-pointer flex items-center justify-center"
      >
        <Typography variant="h6" color={palette.onPrimaryContainer.main}>
          Create Group
        </Typography>
      </Paper>
    </Link>
  )
}

export default CreateGroupButton
