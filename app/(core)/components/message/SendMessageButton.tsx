import { Button, ButtonProps } from "@mui/material"

interface SendMessageButtonProps extends ButtonProps {}

const SendMessageButton: React.FC<SendMessageButtonProps> = ({ ...props }) => {
  return (
    <Button className="rounded-2xl" variant="filled" color="primary" type="submit" {...props}>
      Send
    </Button>
  )
}

export default SendMessageButton
