"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { SendHorizontalIcon } from "lucide-react"
import { useFormStatus } from "react-dom"

interface SendMessageButtonProps extends ButtonProps {}

const SendMessageButton: React.FC<SendMessageButtonProps> = ({ ...props }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      disabled={pending}
      variant="default"
      size="icon"
      type="submit"
      {...props}
    >
      <SendHorizontalIcon />
    </Button>
  )
}

export default SendMessageButton
