"use client"

import { Box, useTheme } from "@mui/material"

interface PostContainerProps {
  hideContainer?: boolean
  children: React.ReactNode
}

const PostContainer: React.FC<PostContainerProps> = ({ hideContainer, children }) => {
  const { palette } = useTheme()

  if (hideContainer) {
    return <>{children}</>
  }

  return (
    <Box
      className="rounded-3xl p-4"
      sx={{
        backgroundColor: palette.surfaceContainer.main,
      }}
    >
      {children}
    </Box>
  )
}

export default PostContainer
