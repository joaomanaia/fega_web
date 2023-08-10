"use client"

import MessageInput from "@/app/(core)/components/message/MessageInput"
import SendMessageButton from "@/app/(core)/components/message/SendMessageButton"
import sendGroupMessage from "@/core/actions/group/sendGroupMessage"
import GroupType from "@/types/group/GroupType"
import { useRef } from "react"

interface GroupMessageFormProps {
  group: GroupType
}

const GroupMessageForm: React.FC<GroupMessageFormProps> = ({ group }) => {
  const ref = useRef<HTMLFormElement>(null)

  return (
    <form ref={ref} action={async formData => {
      const message = formData.get("message")
      if (!message) return
  
      ref.current?.reset()
  
      await sendGroupMessage(group.id, message as string)
    }} className="flex rounded-2xl space-x-2 w-full">
      <MessageInput messageTo={group.name} />
      <SendMessageButton />
    </form>
  )
}

export default GroupMessageForm
