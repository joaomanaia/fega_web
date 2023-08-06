import { forwardRef } from "react"
import MessageInput from "./MessageInput"
import SendMessageButton from "./SendMessageButton"

interface MessageFormProps {
  messageTo: string
  action: (formData: FormData) => void
}

const MessageForm = forwardRef<HTMLFormElement, MessageFormProps>(
  ({ messageTo, action, ...props }, ref) => {
    return (
      <form ref={ref} action={action} className="flex rounded-2xl space-x-2 w-full" {...props}>
        <MessageInput messageTo={messageTo} />
        <SendMessageButton />
      </form>
    )
  }
)

MessageForm.displayName = "MessageForm"

export default MessageForm
