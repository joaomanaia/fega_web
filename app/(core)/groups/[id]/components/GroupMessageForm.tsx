"use client"

import MessageForm from "@/app/(core)/components/message/MessageForm"
import sendGroupMessage from "@/core/actions/group/sendGroupMessage"
import GroupType from "@/types/group/GroupType"
import { useRef } from "react"

interface GroupMessageFormProps {
  group: GroupType
}

const GroupMessageForm: React.FC<GroupMessageFormProps> = ({ group }) => {
  const formRef = useRef<HTMLFormElement>(null)

  console.log(formRef)

  const sendMessage = async (formData: FormData) => {
    const message = formData.get("message")
    if (!message) return

    formRef.current?.reset()

    await sendGroupMessage(group.id, message as string)
  }

  return <MessageForm ref={formRef} messageTo={group.name} action={sendMessage} />
}

export default GroupMessageForm
