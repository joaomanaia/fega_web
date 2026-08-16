"use client"

import { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import RealtimeMessages from "./RealtimeMessages"
import GroupMessageForm from "./message-form"
import { useState } from "react"
import ReplyToType from "@/types/ReplyToType"

interface MessagesWithFormProps {
  groupId: string
  groupName: string
  localUserUid: string
  serverMessages: GroupMessageWithUserType[]
}

export const MessagesWithForm: React.FC<MessagesWithFormProps> = ({
  localUserUid,
  groupId,
  groupName,
  serverMessages: messages,
}) => {
  const [replyTo, setReplyTo] = useState<ReplyToType | null>(null)

  return (
    <>
      <RealtimeMessages
        onReplyClick={setReplyTo}
        localUserUid={localUserUid}
        groupId={groupId}
        serverMessages={messages}
      />
      <GroupMessageForm
        groupId={groupId}
        groupName={groupName}
        replyTo={replyTo}
        clearReplyTo={() => setReplyTo(null)}
      />
    </>
  )
}
