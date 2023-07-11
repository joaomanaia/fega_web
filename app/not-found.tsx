"use client"

import { Box, Button, Typography, alpha, useTheme } from "@mui/material"
import Link from "next/link"

export default function NotFound() {
  const { palette } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="flex items-center space-x-10">
        <Typography variant="h1" fontWeight="bold" color={palette.primary.main}>
          404
        </Typography>
        <Box
          className="w-1 h-24 rounded-2xl"
          sx={{
            backgroundColor: palette.surfaceVariant.main,
          }}
        />
        <Typography variant="h2" fontWeight="bold">
          Page not found
        </Typography>
      </div>

      <Typography variant="body1" fontWeight="bold" color={alpha(palette.primary.main, 0.7)}>
        This page does not exist
      </Typography>

      <div className="flex space-x-2 mt-16">
        <Link href="/">
          <Button variant="filled">Go back home</Button>
        </Link>
      </div>
    </div>
  )
}
