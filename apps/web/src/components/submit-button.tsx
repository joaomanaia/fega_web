"use client"

import React from "react"
import { Button, type ButtonProps } from "@workspace/ui/components/button"
import { useFormStatus } from "react-dom"

export function SubmitButton({ className, variant = "default", ...props }: ButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button variant={variant} type="submit" disabled={pending} className={className} {...props} />
  )
}
