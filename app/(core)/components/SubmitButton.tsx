"use client"

import { Button } from "@mui/material"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  className?: string
  children?: React.ReactNode
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ className, children }) => {
  const { pending } = useFormStatus()

  return (
    <Button variant="filled" type="submit" disabled={pending} className={className}>
      {children}
    </Button>
  )
}
