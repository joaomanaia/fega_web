"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import React from "react"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps extends ButtonProps {}

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const { pending } = useFormStatus()

    return (
      <Button variant={variant} type="submit" disabled={pending} className={className} {...props} />
    )
  }
)
SubmitButton.displayName = "SubmitButton"
