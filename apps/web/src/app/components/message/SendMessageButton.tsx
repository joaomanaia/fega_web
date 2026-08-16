"use client"

import { Button, ButtonProps } from "@workspace/ui/components/button"
import { SendHorizontalIcon } from "lucide-react"
import { useFormStatus } from "react-dom"

const SendMessageButton: React.FC<ButtonProps> = ({ ...props }) => {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} variant="default" size="icon" type="submit" {...props}>
      <SendHorizontalIcon />
    </Button>
  )
}

export default SendMessageButton
