"use client"

import React, { useState } from "react"
import { Database } from "@/types/database.types"
import GroupMessageType, { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"
import { GroupMessage } from "./GroupMessage"
import ScrollContainer from "@/app/(core)/components/ScrollContainer"
import { cn } from "@/lib/utils"
import ReplyToType from "@/types/ReplyToType"

interface RealtimeMessagesProps {
  localUserUid: string
  groupId: string
  serverMessages: GroupMessageWithUserType[]
  onReplyClick: (data: ReplyToType) => void
}

const RealtimeMessages: React.FC<RealtimeMessagesProps> = ({
  localUserUid,
  groupId,
  serverMessages,
  onReplyClick,
}) => {
  const supabase = createClientComponentClient<Database>()

  const getUserByUid = async (uid: string) => {
    const { data: user } = await supabase.from("users").select("*").eq("id", uid).single()

    return {
      user_full_name: user?.full_name ?? "Unknown",
      user_avatar_url: user?.avatar_url ?? "",
    }
  }

  const getMessageById = async (messageId: string) => {
    const { data: message } = await supabase
      .from("group_messages")
      .select("message, uid")
      .eq("id", messageId)
      .single()

    if (!message) {
      return null
    }

    return {
      reply_message: message.message,
      reply_to_uid: message.uid,
    }
  }

  const handleInsert = async (newMessage: GroupMessageType) => {
    if (!messages.find((message) => message.id === newMessage.id)) {
      getUserByUid(newMessage.uid).then((user) => {
        if (newMessage.reply_to) {
          getMessageById(newMessage.reply_to).then((replyMessage) => {
            const newMessageWithUserAndReply: GroupMessageWithUserType = {
              ...newMessage,
              ...user,
              ...replyMessage,
            }
            setMessages((messages) => [...messages, newMessageWithUserAndReply])
          })

          return
        }

        const newMessageWithUser: GroupMessageWithUserType = { ...newMessage, ...user }
        setMessages((messages) => [...messages, newMessageWithUser])
      })
    }
  }

  const handleDelete = (oldMessage: GroupMessageType) => {
    setMessages((messages) => messages.filter((message) => message.id !== oldMessage.id))
  }

  const [messages, setMessages] = useState<GroupMessageWithUserType[]>(serverMessages)

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
  }, [groupId, supabase])

  return (
    <ScrollContainer className="w-full py-4 grow">
      {messages.map((message, index) => (
        <React.Fragment key={message.id}>
          {index < messages.length && (
            <MessageTopTime
              currentTime={new Date(message.created_at!)}
              // If the message is the first one, there is no message above
              // so we pass null to the aboveTime prop to make the component render the date
              aboveTime={index > 0 ? new Date(messages.at(index - 1)!.created_at!) : null}
            />
          )}
          <GroupMessage
            messageId={message.id!}
            message={message.message!}
            createdAt={new Date(message.created_at!)}
            groupId={message.group_id!}
            userName={message.user_full_name!}
            userAvatarUrl={message.user_avatar_url!}
            byLocalUser={message.uid === localUserUid}
            hasMessageAbove={messages.at(index - 1)?.uid === message.uid}
            hasMessageBelow={messages.at(index + 1)?.uid === message.uid}
            replyMessage={message.reply_message ?? null}
            replyToLocalUser={message.reply_to_uid === localUserUid}
            onReplyClick={onReplyClick}
          />
        </React.Fragment>
      ))}
    </ScrollContainer>
  )
}

export default RealtimeMessages

interface ReplyMessageProps {
  message: string
  toLocalUser: boolean
}

const ReplyMessage: React.FC<ReplyMessageProps> = ({ message, toLocalUser }) => {
  return (
    <p
      className={cn(
        "p-3 mt-2 w-fit rounded-t-2xl rounded-b-[4px] opacity-60",
        toLocalUser ? "bg-primary text-primary-foreground" : "border border-border"
      )}
    >
      {message}
    </p>
  )
}

interface MessageTopTime {
  currentTime: Date
  aboveTime: Date | null
}

export const MessageTopTime: React.FC<MessageTopTime> = ({ currentTime, aboveTime }) => {
  const currentDay = currentTime.getDate()

  if (aboveTime?.getDate() === currentDay) {
    return null
  }

  return (
    <div className="flex justify-center items-center my-1">
      <p className="text-xs text-foreground/50 mx-2">{currentTime.toLocaleDateString()}</p>
    </div>
  )
}
