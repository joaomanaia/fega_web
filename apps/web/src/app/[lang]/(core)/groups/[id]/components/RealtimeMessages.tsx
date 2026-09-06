"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "@workspace/ui/components/toast"
import { deleteMessage } from "@/app/actions/group/messageActions"
import { MessageActionDialogs } from "@/components/message/message-dialogs"
import { MessageList } from "@/components/message/message-list"
import { useConfirm } from "@/hooks/use-confirm"
import { createClient } from "@/lib/supabase/client"
import type GroupMessageType from "@/types/group/GroupMessageType"
import type { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
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
  username: string
  full_name: string
  avatar_url: string
}

const RealtimeMessages: React.FC<RealtimeMessagesProps> = ({
  localUserUid,
  groupId,
  serverMessages,
  onReplyClick,
}) => {
  const supabase = useMemo(() => createClient(), [])

  const [messages, setMessages] = useState<GroupMessageWithUserType[]>(serverMessages)

  const [cachedProfiles, setCachedProfiles] = useState<MessageProfile[]>(
    serverMessages.map((message) => ({
      id: message.uid,
      username: message.user_username,
      full_name: message.user_full_name,
      avatar_url: message.user_avatar_url,
    })),
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
        username: user.username,
        full_name: user.full_name ?? "Unknown",
        avatar_url: user.avatar_url ?? "",
      }

      setCachedProfiles((profiles) => [...profiles, profile])

      return profile
    },
    [cachedProfiles, supabase],
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
    [supabase],
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
            user_username: user.full_name,
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
          user_username: user.full_name,
          user_full_name: user.full_name,
          user_avatar_url: user.avatar_url,
        }

        setMessages((messages) => [...messages, newMessageWithUser])
      }
    },
    [fetchProfile, getReplyMessageById, messages],
  )

  const handleDelete = useCallback(async (deletedMessage: GroupMessageType) => {
    setMessages((messages) => messages.filter((message) => message.id !== deletedMessage.id))
  }, [])

  const handleUpdate = useCallback(async (updatedMessage: GroupMessageType) => {
    setMessages((messages) => {
      const updatedIndex = messages.findIndex((message) => message.id === updatedMessage.id)
      const oldMessage = messages[updatedIndex]

      if (updatedIndex === -1 || !oldMessage) {
        return messages
      }

      const newMessage: GroupMessageWithUserType = {
        ...updatedMessage,
        user_username: oldMessage.user_username,
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
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId, supabase, handleDelete, handleInsert, handleUpdate])

  const [DeleteMessageDialog, confirmDeleteMessage] = useConfirm()
  const handleDeleteMessage = async (messageId: string) => {
    const confirmed = await confirmDeleteMessage()
    if (confirmed) {
      toast.promise(deleteMessage({ messageId }), {
        loading: "Deleting...",
        success: "Message deleted",
        error: "Failed to delete message",
      })
    }
  }

  return (
    <>
      <ScrollContainer className="w-full grow">
        <ul className="w-full grow py-4">
          <MessageList
            localUserId={localUserUid}
            messages={messages}
            onReplyClick={onReplyClick}
            onDeleteClick={handleDeleteMessage}
          />
        </ul>
      </ScrollContainer>

      <DeleteMessageDialog
        title="Delete Message"
        message="Are you sure you want to delete this message?"
      />

      <MessageActionDialogs />
    </>
  )
}

export default RealtimeMessages

interface MessageTopTime {
  dateFormatted: string
}

export function MessageTopTime({ dateFormatted }: MessageTopTime) {
  return (
    <li className="my-1 flex items-center justify-center">
      <p className="text-foreground/50 mx-2 text-xs">{dateFormatted}</p>
    </li>
  )
}
