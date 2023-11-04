"use client"

import { Button, ButtonProps } from "@mui/material"
import { useFormStatus } from "react-dom"

interface SendMessageButtonProps extends ButtonProps {}

const SendMessageButton: React.FC<SendMessageButtonProps> = ({ ...props }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      disabled={pending}
      className="rounded-2xl"
      variant="filled"
      color="primary"
      type="submit"
      {...props}
    >
      {pending ? "Sending..." : "Send"}
    </Button>
  )
}

export default SendMessageButton
