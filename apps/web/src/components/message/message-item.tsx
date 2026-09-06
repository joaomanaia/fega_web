"use client"

import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { Hint } from "@/components/hint"
import Link from "@/components/link"
import { MessageDropdownActions } from "@/components/message/dropdown-actions"
import type ReplyToType from "@/types/ReplyToType"

export type MessageGroupPosition = "single" | "first" | "middle" | "last"

export type MessageItemProps = {
  messageId: string
  content: string
  byLocalUser: boolean
  username?: string
  userFullName?: string
  userAvatarUrl?: string | null
  showAuthor?: boolean
  groupPosition?: MessageGroupPosition
  dateFormatted: string
  onReplyClick?: (data: ReplyToType) => void
  replyContent?: string | null
  replyToMessageId?: string | null
  replyToName?: string | null
  onDelete: () => void
}

export function MessageItem({
  messageId,
  content,
  byLocalUser,
  username,
  userFullName,
  userAvatarUrl,
  showAuthor,
  groupPosition = "single",
  dateFormatted,
  onReplyClick,
  replyContent,
  replyToMessageId,
  replyToName,
  onDelete,
}: MessageItemProps) {
  return (
    <div className="group flex w-full flex-col gap-1">
      {showAuthor && !byLocalUser && (
        <div className="mt-2 flex items-center gap-2">
          <Link href={`/${username}`}>
            <UserAvatar src={userAvatarUrl} name={userFullName} alt={userFullName} size="sm" />
          </Link>
          <Link href={`/${username}`}>
            <p className="my-0 text-sm font-medium">{userFullName}</p>
          </Link>
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-1",
          // For local user: [actions][bubble] aligned to the right.
          // For remote user: flex-row-reverse gives [bubble][actions] aligned to the left.
          byLocalUser ? "self-end" : "flex-row-reverse self-start",
        )}
      >
        {/* Action buttons – visible on hover or while the dropdown is open */}
        <MessageDropdownActions
          messageId={messageId}
          content={content}
          onReplyClick={onReplyClick}
          userFullName={userFullName}
          byLocalUser={byLocalUser}
          onDelete={onDelete}
        />

        {/* Message bubble */}
        <Bubble align={byLocalUser ? "end" : "start"} variant={byLocalUser ? "default" : "outline"}>
          <Hint
            label={dateFormatted}
            render={
              <BubbleContent
                data-slot="bubble-content"
                className={cn(getGroupCornerClassName(byLocalUser, groupPosition))}
              />
            }
          >
            {replyContent && replyToMessageId && (
              <ReplyPreview
                replyToMessageId={replyToMessageId}
                content={replyContent}
                byLocalUser={byLocalUser}
                senderName={replyToName ?? undefined}
              />
            )}
            {content}
          </Hint>
        </Bubble>
      </div>
    </div>
  )
}

type ReplyPreviewProps = {
  replyToMessageId: string
  content: string
  byLocalUser: boolean
  senderName?: string
}

function ReplyPreview({ replyToMessageId, content, byLocalUser, senderName }: ReplyPreviewProps) {
  const handleClick = () => {
    const el = document.getElementById(replyToMessageId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "mb-1.5 flex w-full cursor-pointer flex-col gap-0.5 rounded-xl px-2.5 py-1.5 text-left text-sm transition-opacity hover:opacity-70",
        // Subtle background overlay — works on both bubble variants
        byLocalUser ? "bg-black/15" : "bg-black/5 dark:bg-white/10",
      )}
    >
      {senderName && (
        <span
          className={cn(
            "truncate text-xs font-semibold",
            byLocalUser ? "text-primary-foreground/80" : "text-foreground/60",
          )}
        >
          {senderName}
        </span>
      )}
      <span
        className={cn(
          "line-clamp-2 whitespace-pre-wrap",
          byLocalUser ? "text-primary-foreground/70" : "text-foreground/50",
        )}
      >
        {content}
      </span>
    </button>
  )
}

// Bubbles anchor to the side matching their alignment (left for received
// messages, right for sent ones). Grouped bubbles flatten the corner on that
// anchor side where they touch a neighboring bubble, similar to iMessage/WhatsApp.
//
// Class names must be fully static strings (not built via interpolation) so
// Tailwind's content scanner can detect and generate them.
function getGroupCornerClassName(byLocalUser: boolean, groupPosition: MessageGroupPosition) {
  if (byLocalUser) {
    switch (groupPosition) {
      case "first":
        return "rounded-br-md"
      case "last":
        return "rounded-tr-md"
      case "middle":
        return "rounded-tr-md rounded-br-md"
      case "single":
        return undefined
    }
  }

  switch (groupPosition) {
    case "first":
      return "rounded-bl-md"
    case "last":
      return "rounded-tl-md"
    case "middle":
      return "rounded-tl-md rounded-bl-md"
    case "single":
      return undefined
  }
}
