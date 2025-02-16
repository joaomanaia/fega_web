"use client"

import { SubmitButton } from "@/components/submit-button"
import { deleteMessage, editMessage } from "@/app/actions/group/messageActions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MoreVerticalIcon, ReplyIcon } from "lucide-react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { useState } from "react"
import ReplyToType from "@/types/ReplyToType"
import Link from "next/link"

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
  uid,
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
    <li className="flex flex-col w-full group" id={messageId}>
      {!byLocalUser && !hasMessageAbove && (
        <div className="flex items-center space-x-2">
          <Link href={`/${username}`}>
            <Avatar className="h-4 w-4">
              <AvatarImage src={userAvatarUrl ?? undefined} />
              <AvatarFallback>{userFullname}</AvatarFallback>
            </Avatar>
          </Link>

          <Link href={`/${username}`}>
            <p className="my-0">{userFullname}</p>
          </Link>
        </div>
      )}

      <div
        className={cn(
          "flex items-center justify-center gap-2",
          byLocalUser ? "self-end" : "self-start flex-row-reverse"
        )}
      >
        <>
          <Button
            onClick={() => onReplyClick({ messageId, replyToName: userFullname, message })}
            variant="ghost"
            size="icon"
            className="hidden group-hover:inline-flex"
          >
            <ReplyIcon className="w-5 h-5 text-foreground" />
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
              <MoreVerticalIcon className="w-5 h-5 text-foreground" />
            </Button>
          </MessageOptionsDropdown>
        </>

        <MessageDateTimeTooltip createdAt={createdAt}>
          <div
            className={cn(
              "p-3 w-fit rounded-2xl",
              byLocalUser ? "bg-primary text-primary-foreground" : "border border-border",
              messageCorners(),
              margins()
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
        </MessageDateTimeTooltip>
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

    toast.success("Message copied to clipboard")
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
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
        "p-3 mb-2 w-full rounded-2xl",
        toLocalUser ? "bg-primary text-primary-foreground" : "bg-surface text-surface-foreground",
        byLocalUser && toLocalUser && "border border-surface",
        replyMessageToElement && "cursor-pointer"
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

interface MessageDateTimeTooltipProps {
  createdAt: Date
  children: React.ReactNode
}

const MessageDateTimeTooltip: React.FC<MessageDateTimeTooltipProps> = ({ createdAt, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-surface border-outline/10">
          <p>{createdAt.toLocaleString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
  const editMessageWithId = editMessage.bind(null, messageId, groupId)

  const form = useForm<z.infer<typeof editMessageFormSchema>>({
    resolver: zodResolver(editMessageFormSchema),
    defaultValues: {
      message: currentMessage,
    },
  })

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              action={async (formData: FormData) => {
                // Check if the message is the same as the current message
                if (formData.get("message") === currentMessage) {
                  toast.error("Message is the same as the current message")
                  return
                }

                const result = await editMessageWithId(formData)
                if (result?.errorMessage) {
                  toast.error(result.errorMessage)
                  return
                }

                toast.success("Message edited")
              }}
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
                        className="border-none mt-2"
                        placeholder="Message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
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
  const deleteMessageWithId = deleteMessage.bind(null, messageId)

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <SubmitButton
                variant="ghost"
                onClick={async () => {
                  const result = await deleteMessageWithId()
                  if (result?.errorMessage) {
                    return toast.error(result.errorMessage)
                  }

                  toast.success("Message deleted")
                }}
              >
                Delete
              </SubmitButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
