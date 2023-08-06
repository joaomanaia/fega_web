import MessageInput from "./MessageInput"
import SendMessageButton from "./SendMessageButton"

interface MessageFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  messageTo: string
}

const MessageForm: React.FC<MessageFormProps> = ({ messageTo, ...props }) => {
  const sendMessage = async (formData: FormData) => {
    "use server"

    console.log(formData)
  }

  return (
    <form action={sendMessage} className="flex rounded-2xl space-x-2 w-full" {...props}>
      <MessageInput messageTo={messageTo} />
      <SendMessageButton />
    </form>
  )
}

export default MessageForm
