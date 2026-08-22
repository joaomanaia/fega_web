"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { MoreVerticalIcon, ReplyIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { deleteMessage, editMessage } from "@/app/actions/group/messageActions"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { Hint } from "@/components/hint"
import Link from "@/components/link"
import { SubmitButton } from "@/components/submit-button"
import ReplyToType from "@/types/ReplyToType"

type GroupMessageProps = {
  messageId: string
  message: string
  createdAt: Date
  groupId: string
  uid: string
  username: string
  userFullname: string
  userAvatarUrl: string | null
  byLocalUser: boolean
  hasMessageAbove: boolean
  hasMessageBelow: boolean
  replyMessage: string | null
  replyToMessageId: string | null
  replyToLocalUser: boolean
  onReplyClick: (data: ReplyToType) => void
}

export const GroupMessage: React.FC<GroupMessageProps> = ({
  messageId,
  message,
  createdAt,
  groupId,
  username,
  userFullname,
  userAvatarUrl,
  byLocalUser,
  hasMessageAbove,
  hasMessageBelow,
  replyMessage,
  replyToMessageId,
  replyToLocalUser,
  onReplyClick,
}) => {
  const messageCorners = (): string => {
    if (hasMessageAbove && hasMessageBelow) {
      return byLocalUser ? "rounded-r-[8px]" : "rounded-l-[8px]"
    } else if (hasMessageAbove && !hasMessageBelow) {
      return byLocalUser ? "rounded-tr-[8px]" : "rounded-tl-[8px]"
    } else if (!hasMessageAbove && hasMessageBelow) {
      return byLocalUser ? "rounded-br-[8px]" : "rounded-bl-[8px]"
    } else {
      return ""
    }
  }

  const margins = (): string => {
    if (hasMessageAbove && hasMessageBelow) {
      return "my-[2px]"
    } else if (hasMessageAbove && !hasMessageBelow) {
      return "mt-[2px] mb-2"
    } else if (!hasMessageAbove && hasMessageBelow) {
      return "mb-[2px] mt-2"
    } else {
      return "my-2"
    }
  }

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false)

  return (
    <li className="group flex w-full flex-col" id={messageId}>
      {!byLocalUser && !hasMessageAbove && (
        <div className="flex items-center space-x-2">
          <Link href={`/${username}`}>
            <UserAvatar src={userAvatarUrl} name={userFullname} alt={userFullname} size="sm" />
          </Link>

          <Link href={`/${username}`}>
            <p className="my-0">{userFullname}</p>
          </Link>
        </div>
      )}

      <div
        className={cn(
          "flex items-center justify-center gap-2",
          byLocalUser ? "self-end" : "flex-row-reverse self-start",
        )}
      >
        <>
          <Button
            onClick={() => onReplyClick({ messageId, replyToName: userFullname, message })}
            variant="ghost"
            size="icon"
            className="hidden group-hover:inline-flex"
          >
            <ReplyIcon className="text-foreground h-5 w-5" />
          </Button>
          <MessageOptionsDropdown
            open={moreOptionsOpen}
            onOpenChange={setMoreOptionsOpen}
            messageId={messageId}
            groupId={groupId}
            message={message}
            byLocalUser={byLocalUser}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(moreOptionsOpen ? "inline-flex" : "hidden group-hover:inline-flex")}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setMoreOptionsOpen(!moreOptionsOpen)
              }}
            >
              <MoreVerticalIcon className="text-foreground h-5 w-5" />
            </Button>
          </MessageOptionsDropdown>
        </>

        <Hint label={createdAt.toLocaleString()}>
          <div
            className={cn(
              "w-fit rounded-2xl p-3",
              byLocalUser ? "bg-primary text-primary-foreground" : "border-border border",
              messageCorners(),
              margins(),
            )}
          >
            {replyMessage && (
              <ReplyMessage
                replyToMessageId={replyToMessageId!}
                message={replyMessage}
                byLocalUser={byLocalUser}
                toLocalUser={replyToLocalUser}
              />
            )}
            <p>{message}</p>
          </div>
        </Hint>
      </div>
    </li>
  )
}

interface MessageOptionsDropdownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: string
  groupId: string
  message: string
  byLocalUser: boolean
  children: React.ReactNode
}

const MessageOptionsDropdown: React.FC<MessageOptionsDropdownProps> = ({
  open,
  onOpenChange,
  messageId,
  groupId,
  message,
  byLocalUser,
  children,
}) => {
  const copyMessage = () => {
    navigator.clipboard.writeText(message)

    toast.add({ type: "success", description: "Message copied to clipboard" })
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={copyMessage}>Copy</DropdownMenuItem>
        {byLocalUser && (
          <>
            <DropdownMenuSeparator />
            <EditMessage messageId={messageId} groupId={groupId} currentMessage={message} />
            <DeleteMessage messageId={messageId} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ReplyMessageProps {
  replyToMessageId: string
  message: string
  byLocalUser: boolean
  toLocalUser: boolean
}

const ReplyMessage: React.FC<ReplyMessageProps> = ({
  replyToMessageId,
  message,
  byLocalUser,
  toLocalUser,
}) => {
  const replyMessageToElement = document.getElementById(replyToMessageId)

  return (
    <p
      className={cn(
        "mb-2 w-full rounded-2xl p-3",
        toLocalUser ? "bg-primary text-primary-foreground" : "bg-surface text-surface-foreground",
        byLocalUser && toLocalUser && "border-surface border",
        replyMessageToElement && "cursor-pointer",
      )}
      onClick={() => {
        // Scroll to the message
        if (replyMessageToElement) {
          replyMessageToElement.scrollIntoView({ behavior: "smooth" })
        }
      }}
    >
      {message}
    </p>
  )
}

interface EditMessageProps {
  messageId: string
  groupId: string
  currentMessage: string
}

const editMessageFormSchema = z.object({
  message: z
    .string()
    .min(1, "Message must be at least 1 character long")
    .max(500, "Message cannot be longer than 500 characters"),
})

const EditMessage: React.FC<EditMessageProps> = ({ messageId, groupId, currentMessage }) => {
  const form = useForm<z.infer<typeof editMessageFormSchema>>({
    resolver: zodResolver(editMessageFormSchema),
    defaultValues: {
      message: currentMessage,
    },
  })

  return (
    <>
      <Dialog>
        <DialogTrigger render={<DropdownMenuItem onSelect={(e) => e.preventDefault()} />}>
          Edit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                if (values.message === currentMessage) {
                  toast.add({
                    type: "error",
                    description: "Message is the same as the current message",
                  })
                  return
                }

                const result = await editMessage({
                  messageId,
                  groupId,
                  message: values.message,
                })
                if (result?.serverError) {
                  toast.add({ type: "error", description: result.serverError })
                  return
                }

                toast.add({ type: "success", description: "Message edited" })
              })}
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input
                        required
                        maxLength={500}
                        className="mt-2 border-none"
                        placeholder="Message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                <SubmitButton variant="ghost">Save</SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface DeleteMessageProps {
  messageId: string
}

const DeleteMessage: React.FC<DeleteMessageProps> = ({ messageId }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger render={<DropdownMenuItem onSelect={(e) => e.preventDefault()} />}>
          Delete
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <DialogClose
              onClick={async () => {
                const result = await deleteMessage({ messageId })
                if (result?.serverError) {
                  return toast.add({ type: "error", description: result.serverError })
                }

                toast.add({ type: "success", description: "Message deleted" })
              }}
              render={<SubmitButton variant="ghost" />}
            >
              Delete
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
