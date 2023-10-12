"use client"

import { Box, useTheme } from "@mui/material"
import { cn } from "@/core/util/tailwindcssUtils"

interface PostContainerProps {
  hideContainer?: boolean
  className?: string
  children: React.ReactNode
}

const PostContainer: React.FC<PostContainerProps> = ({ hideContainer, className, children }) => {
  const { palette } = useTheme()

  if (hideContainer) {
    return <>{children}</>
  }

  return (
    <Box
      className={cn("p-4 pb-2 rounded-3xl", className)}
      sx={{
        backgroundColor: palette.surfaceContainer.main,
      }}
    >
      {children}
    </Box>
  )
}

export default PostContainer
