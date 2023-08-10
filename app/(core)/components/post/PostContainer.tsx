"use client"

import { Box, Divider, alpha, useTheme } from "@mui/material"
import { twMerge } from "tailwind-merge"

interface PostContainerProps {
  hideContainer?: boolean
  actionsContent?: React.ReactNode
  children: React.ReactNode
}

const PostContainer: React.FC<PostContainerProps> = ({
  hideContainer,
  actionsContent,
  children,
}) => {
  const { palette } = useTheme()

  if (hideContainer) {
    return <>{children}</>
  }

  return (
    <div>
      <Box
        className={twMerge("p-4 pb-2", actionsContent ? "rounded-t-3xl" : "rounded-3xl")}
        sx={{
          backgroundColor: palette.surfaceContainer.main,
        }}
      >
        {children}
      </Box>
      {actionsContent && (
        <Box
          className="mt-0 rounded-b-3xl "
          sx={{
            backgroundColor: palette.surfaceContainer.main,
          }}
        >
          <Box className="h-[1px] w-auto mx-4" sx={{
            backgroundColor: alpha(palette.divider, 0.25),
          }}/>
          <div className="p-4">{actionsContent}</div>
        </Box>
      )}
    </div>
  )
}

export default PostContainer
