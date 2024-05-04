interface MessageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  messageTo: string
}

const MessageInput: React.FC<MessageInputProps> = ({ messageTo, ...props }) => {
  return (
    <>
      <input
        className="bg-accent/[0.38] rounded-2xl py-2 px-4 border-0 outline-none text-lg w-full"
        type="text"
        name="message"
        maxLength={512}
        placeholder={`Message to ${messageTo}`}
        {...props}
      />
    </>
  )
}

export default MessageInput
