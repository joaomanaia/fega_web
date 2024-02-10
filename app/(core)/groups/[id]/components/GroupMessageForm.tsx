"use client"

import MessageInput from "@/app/(core)/components/message/MessageInput"
import SendMessageButton from "@/app/(core)/components/message/SendMessageButton"
import sendGroupMessage from "@/core/actions/group/sendGroupMessage"
import { useRef } from "react"

interface GroupMessageFormProps {
  groupId: string
  groupName: string
}

const GroupMessageForm: React.FC<GroupMessageFormProps> = ({ groupId, groupName }) => {
  const ref = useRef<HTMLFormElement>(null)

  return (
    <form ref={ref} action={async formData => {
      const message = formData.get("message")
      if (!message) return
  
      ref.current?.reset()
  
      await sendGroupMessage(groupId, message as string)
    }} className="flex rounded-2xl space-x-2 w-full">
      <MessageInput messageTo={groupName} />
      <SendMessageButton className="h-full rounded-2xl" />
    </form>
  )
}

export default GroupMessageForm
