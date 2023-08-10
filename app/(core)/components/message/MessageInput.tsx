"use client"

import { useTheme } from "@mui/material"

interface MessageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  messageTo: string
}

const MessageInput: React.FC<MessageInputProps> = ({ messageTo, ...props }) => {
  const { palette } = useTheme()

  return (
    <>
      <input
        className="bg-transparent rounded-2xl py-2 px-4 border-0 outline-none text-lg w-full"
        type="text"
        name="message"
        maxLength={512}
        placeholder={`Message to ${messageTo}`}
        {...props}
        style={{
          color: palette.text.primary,
          backgroundColor: palette.background.default,
        }}
      />
    </>
  )
}

export default MessageInput
