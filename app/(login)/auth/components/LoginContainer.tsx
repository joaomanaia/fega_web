"use client"

import { Box, Typography, useTheme } from "@mui/material"

interface LoginContainerProps {
  children: React.ReactNode
}

const LoginContainer: React.FC<LoginContainerProps> = ({ children }) => {
  const { palette } = useTheme()

  return (
    <Box
      bgcolor={palette.primary.main}
      color={palette.onPrimary.main}
      className="h-screen w-screen flex flex-col md:flex-row items-center justify-center"
    >
      <Box className="h-full w-1/2 flex flex-col items-center justify-center">
        <Typography variant="h2" fontWeight="400" gutterBottom>
          Welcome to Fega
        </Typography>

        <Typography variant="h6">Best social network in ega!</Typography>
      </Box>

      <Box
        bgcolor={palette.surface.main}
        color={palette.onSurface.main}
        className="h-full w-full md:w-1/2 rounded-t-3xl md:rounded-none md:rounded-l-3xl flex flex-col items-center justify-center"
      >
        <Typography variant="h2" fontWeight="400" gutterBottom>
          Sign In
        </Typography>
        {children}
      </Box>
    </Box>
  )
}

export default LoginContainer