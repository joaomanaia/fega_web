"use client"

import { SendHorizontalIcon } from "lucide-react"
import { useFormStatus } from "react-dom"
import { Button, ButtonProps } from "@/components/ui/button"

const SendMessageButton: React.FC<ButtonProps> = ({ ...props }) => {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} variant="default" size="icon" type="submit" {...props}>
      <SendHorizontalIcon />
    </Button>
  )
}

export default SendMessageButton
