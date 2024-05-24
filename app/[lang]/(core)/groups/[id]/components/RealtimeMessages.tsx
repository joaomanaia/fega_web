"use client"

import React, { useCallback, useMemo, useState } from "react"
import type { Database } from "@/types/database.types"
import type GroupMessageType from "@/types/group/GroupMessageType"
import type { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"
import { GroupMessage } from "./GroupMessage"
import { cn } from "@/lib/utils"
import type ReplyToType from "@/types/ReplyToType"
import ScrollContainer from "../../../../../components/ScrollContainer"

interface RealtimeMessagesProps {
  localUserUid: string
  groupId: string
  serverMessages: GroupMessageWithUserType[]
  onReplyClick: (data: ReplyToType) => void
}

type MessageProfile = {
  id: string
  full_name: string
  avatar_url: string
}

const RealtimeMessages: React.FC<RealtimeMessagesProps> = ({
  localUserUid,
  groupId,
  serverMessages,
  onReplyClick,
}) => {
  const supabase = useMemo(() => createClientComponentClient<Database>(), [])

  const [messages, setMessages] = useState<GroupMessageWithUserType[]>(serverMessages)

  const [cachedProfiles, setCachedProfiles] = useState<MessageProfile[]>(
    serverMessages.map((message) => ({
      id: message.uid,
      full_name: message.user_full_name,
      avatar_url: message.user_avatar_url,
    }))
  )

  const fetchProfile = useCallback(
    async (uid: string): Promise<MessageProfile> => {
      // Check if the profile is already cached
      const cachedProfile = cachedProfiles.find((p) => p.id === uid)
      if (cachedProfile) {
        return cachedProfile
      }

      const { error, data: user } = await supabase.from("users").select("*").eq("id", uid).single()

      if (error || !user) {
        throw new Error("Failed to fetch user profile")
      }

      const profile: MessageProfile = {
        id: user.id,
        full_name: user.full_name ?? "Unknown",
        avatar_url: user.avatar_url ?? "",
      }

      setCachedProfiles((profiles) => [...profiles, profile])

      return profile
    },
    [cachedProfiles, supabase]
  )

  const getReplyMessageById = useCallback(
    async (messageId: string) => {
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
    },
    [supabase]
  )

  const handleInsert = useCallback(
    async (newMessage: GroupMessageType) => {
      // Check if the message is already in the list
      if (messages.find((message) => message.id === newMessage.id)) {
        return
      }

      const user = await fetchProfile(newMessage.uid)

      if (newMessage.reply_to) {
        const replyMessage = await getReplyMessageById(newMessage.reply_to)

        if (replyMessage) {
          const replyMessageUser = {
            user_full_name: user.full_name,
            user_avatar_url: user.avatar_url,
          }

          const newMessageWithUserAndReply: GroupMessageWithUserType = {
            ...newMessage,
            ...replyMessageUser,
            ...replyMessage,
          }
          setMessages((messages) => [...messages, newMessageWithUserAndReply])
        }
      } else {
        const newMessageWithUser: GroupMessageWithUserType = {
          ...newMessage,
          user_full_name: user.full_name,
          user_avatar_url: user.avatar_url,
        }

        setMessages((messages) => [...messages, newMessageWithUser])
      }
    },
    [fetchProfile, getReplyMessageById, messages]
  )

  const handleDelete = useCallback(async (deletedMessage: GroupMessageType) => {
    setMessages((messages) => messages.filter((message) => message.id !== deletedMessage.id))
  }, [])

  const handleUpdate = useCallback(async (updatedMessage: GroupMessageType) => {
    setMessages((messages) => {
      const updatedIndex = messages.findIndex((message) => message.id === updatedMessage.id)
      const oldMessage = messages[updatedIndex]

      if (updatedIndex === -1) {
        return messages
      }

      const newMessage: GroupMessageWithUserType = {
        ...updatedMessage,
        user_full_name: oldMessage.user_full_name,
        user_avatar_url: oldMessage.user_avatar_url,
        reply_message: oldMessage.reply_message,
        reply_to_uid: oldMessage.reply_to_uid,
        reply_to: oldMessage.reply_to,
      }

      messages[updatedIndex] = newMessage

      return [...messages]
    })
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-group-messages-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          switch (payload.eventType) {
            case "DELETE":
              await handleDelete(payload.old as GroupMessageType)
              break
            case "INSERT":
              await handleInsert(payload.new as GroupMessageType)
              break
            case "UPDATE":
              await handleUpdate(payload.new as GroupMessageType)
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId, supabase, handleDelete, handleInsert, handleUpdate])

  return (
    <ScrollContainer className="w-full grow">
      <ul className="w-full py-4 grow">
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
              uid={message.uid!}
              userName={message.user_full_name!}
              userAvatarUrl={message.user_avatar_url!}
              byLocalUser={message.uid === localUserUid}
              hasMessageAbove={messages.at(index - 1)?.uid === message.uid}
              hasMessageBelow={messages.at(index + 1)?.uid === message.uid}
              replyMessage={message.reply_message ?? null}
              replyToMessageId={message.reply_to ?? null}
              replyToLocalUser={message.reply_to_uid === localUserUid}
              onReplyClick={onReplyClick}
            />
          </React.Fragment>
        ))}
      </ul>
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
    <li className="flex justify-center items-center my-1">
      <p className="text-xs text-foreground/50 mx-2">{currentTime.toLocaleDateString()}</p>
    </li>
  )
}
