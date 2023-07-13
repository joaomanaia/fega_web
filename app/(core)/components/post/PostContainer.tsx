"use client"

import { Box, useTheme } from "@mui/material"

interface PostContainerProps {
  children: React.ReactNode
}

const PostContainer: React.FC<PostContainerProps> = ({ children }) => {
  const { palette } = useTheme()

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
