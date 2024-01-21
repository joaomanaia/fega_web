"use client"

import { useState } from "react"
import { Database } from "@/types/database.types"
import GroupMessageType, { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"
import GroupMessage from "./GroupMessage"
import UserType from "@/types/UserType"
import ScrollContainer from "@/app/(core)/components/ScrollContainer"

interface RealtimeMessagesProps {
  localUserUid: string
  groupId: string
  serverMessages: GroupMessageWithUserType[]
}

const RealtimeMessages: React.FC<RealtimeMessagesProps> = ({
  localUserUid,
  groupId,
  serverMessages,
}) => {
  const supabase = createClientComponentClient<Database>()

  const getUserByUid = async (uid: string): Promise<UserType> => {
    const { data: user } = await supabase.from("users").select("*").eq("id", uid).single()

    return user as UserType
  }

  const [messages, setMessages] = useState(serverMessages)

  useEffect(() => {
    const channel = supabase
      .channel("realtime group messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => handleInsert(payload.new as GroupMessageType)
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => handleDelete(payload.old as GroupMessageType)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleInsert = async (newMessage: GroupMessageType) => {
    if (!messages.find((message) => message.id === newMessage.id)) {
      getUserByUid(newMessage.uid).then((user) => {
        const newMessageWithUser: GroupMessageWithUserType = { ...newMessage, user }
        setMessages((messages) => [...messages, newMessageWithUser])
      })
    }
  }

  const handleDelete = (oldMessage: GroupMessageType) => {
    setMessages((messages) => messages.filter((message) => message.id !== oldMessage.id))
  }

  return (
    <ScrollContainer className="w-full p-4 grow">
      {messages.map((message, index) => (
        <GroupMessage
          key={message.id}
          message={message.message}
          user={message.user}
          byLocalUser={message.uid === localUserUid}
          hasMessageAbove={messages.at(index - 1)?.uid === message.uid}
          hasMessageBelow={messages.at(index + 1)?.uid === message.uid}
        />
      ))}
    </ScrollContainer>
  )
}

export default RealtimeMessages
