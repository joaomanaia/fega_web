"use client"

import React from "react"
import { useFormStatus } from "react-dom"
import { Button, ButtonProps } from "@/components/ui/button"

export const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const { pending } = useFormStatus()

    return (
      <Button
        variant={variant}
        type="submit"
        disabled={pending}
        className={className}
        ref={ref}
        {...props}
      />
    )
  }
)
SubmitButton.displayName = "SubmitButton"
