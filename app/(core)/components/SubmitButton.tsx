"use client"

import { Button } from "@mui/material"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  className?: string
  text: string
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ className, text }) => {
  const { pending } = useFormStatus()

  return (
    <Button variant="filled" type="submit" disabled={pending} className={className}>
      {text}
    </Button>
  )
}
