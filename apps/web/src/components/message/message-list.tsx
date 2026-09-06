import React from "react"
import { BubbleGroup } from "@workspace/ui/components/bubble"
import { isSameDay } from "date-fns"
import { useFormatter } from "next-intl"
import { MessageItem, type MessageGroupPosition } from "@/components/message/message-item"
import type { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import type ReplyToType from "@/types/ReplyToType"

type MessageListProps = {
  localUserId: string
  messages: GroupMessageWithUserType[]
  onReplyClick: (data: ReplyToType) => void
  onDeleteClick: (messageId: string) => void
}

export function MessageList({
  localUserId,
  messages,
  onReplyClick,
  onDeleteClick,
}: MessageListProps) {
  const formatter = useFormatter()
  const messageGroups = groupMessagesBySender(messages)

  // Build a uid -> full_name map for resolving reply sender names
  const uidToName = React.useMemo(() => {
    const map = new Map<string, string>()
    for (const msg of messages) {
      if (msg.uid && msg.user_full_name) map.set(msg.uid, msg.user_full_name)
    }
    return map
  }, [messages])

  return (
    <>
      {messageGroups.map((group, groupIndex) => {
        const firstMessage = group[0]!
        const previousMessage = messageGroups[groupIndex - 1]?.at(-1)

        return (
          <React.Fragment key={firstMessage.id}>
            {previousMessage &&
              !isSameDay(
                new Date(firstMessage.created_at),
                new Date(previousMessage.created_at),
              ) && (
                <MessageTopTime
                  dateFormatted={formatter.dateTime(new Date(firstMessage.created_at!))}
                />
              )}
            <BubbleGroup>
              {group.map((message, messageIndex) => (
                <MessageItem
                  key={message.id}
                  messageId={message.id}
                  content={message.message}
                  byLocalUser={message.uid === localUserId}
                  username={message.user_username}
                  userFullName={message.user_full_name}
                  userAvatarUrl={message.user_avatar_url}
                  showAuthor={messageIndex === 0}
                  groupPosition={getGroupPosition(messageIndex, group.length)}
                  dateFormatted={formatter.dateTime(new Date(message.created_at!))}
                  onReplyClick={onReplyClick}
                  replyContent={message.reply_message}
                  replyToMessageId={message.reply_to}
                  replyToName={
                    message.reply_to_uid ? (uidToName.get(message.reply_to_uid) ?? null) : null
                  }
                  onDelete={() => onDeleteClick(message.id)}
                />
              ))}
            </BubbleGroup>
          </React.Fragment>
        )
      })}
    </>
  )
}

function getGroupPosition(messageIndex: number, groupLength: number): MessageGroupPosition {
  if (groupLength === 1) {
    return "single"
  }
  if (messageIndex === 0) {
    return "first"
  }
  if (messageIndex === groupLength - 1) {
    return "last"
  }
  return "middle"
}

function groupMessagesBySender(messages: GroupMessageWithUserType[]): GroupMessageWithUserType[][] {
  const groups: GroupMessageWithUserType[][] = []

  for (const message of messages) {
    const lastGroup = groups.at(-1)

    if (lastGroup && lastGroup[0]!.uid === message.uid) {
      lastGroup.push(message)
    } else {
      groups.push([message])
    }
  }

  return groups
}

export function MessageTopTime({ dateFormatted }: { dateFormatted: string }) {
  return (
    <li className="my-1 flex items-center justify-center">
      <p className="text-foreground/50 mx-2 text-xs">{dateFormatted}</p>
    </li>
  )
}
