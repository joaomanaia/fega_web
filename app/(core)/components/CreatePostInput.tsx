"use client"

import { cn } from "@/core/util/tailwindcssUtils"
import { useTheme } from "@mui/material"
import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { palette } = useTheme()

    return (
      <input
        type={type}
        className={cn("w-full py-4 px-4 text-sm rounded-full border-none", className)}
        style={{
          backgroundColor: palette.surfaceContainerHigh.main,
          color: palette.text.primary,
        }}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
