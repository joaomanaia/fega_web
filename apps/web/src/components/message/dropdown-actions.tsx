"use client"

import { useState } from "react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { MoreVerticalIcon, ReplyIcon } from "lucide-react"
import { useMessageOptionsStore } from "@/hooks/use-message-options"
import type ReplyToType from "@/types/ReplyToType"

export function MessageDropdownActions({
  messageId,
  content,
  onReplyClick,
  userFullName,
  byLocalUser,
  onDelete,
}: {
  messageId: string
  content: string
  onReplyClick?: (data: ReplyToType) => void
  userFullName?: string
  byLocalUser?: boolean
  onDelete: () => void
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { openDialog } = useMessageOptionsStore()

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 transition-opacity duration-100",
        dropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
      )}
    >
      {onReplyClick && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            onReplyClick({
              messageId,
              message: content,
              replyToName: userFullName ?? "",
            })
          }
        >
          <ReplyIcon />
          <span className="sr-only">Reply</span>
        </Button>
      )}

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          aria-label="Message options"
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(content)
              toast.add({ type: "success", description: "Copied to clipboard" })
            }}
          >
            Copy
          </DropdownMenuItem>
          {byLocalUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openDialog({ type: "edit", messageId, content })}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => onDelete()}>
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
