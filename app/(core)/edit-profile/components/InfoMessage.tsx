"use client"

import { useTheme } from "@mui/material"
import React from "react"

interface ErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  type: "error" | "success"
}

export const InfoMessage = React.forwardRef<HTMLParagraphElement, ErrorTextProps>(
  ({ ...props }, ref) => {
    const { palette } = useTheme()

    return (
      <p
        style={{
          color: props.type === "error" ? palette.error.main : palette.success.main,
        }}
        ref={ref}
        {...props}
      />
    )
  }
)

InfoMessage.displayName = "ErrorText"
