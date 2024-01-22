"use client"

import { SubmitButton } from "@/app/(core)/components/SubmitButton"
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
import UserType from "@/types/UserType"
import { MoreVerticalIcon } from "lucide-react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

type GroupMessageProps = {
  messageId: string
  message: string
  groupId: string
  user: UserType
  byLocalUser: boolean
  hasMessageAbove: boolean
  hasMessageBelow: boolean
}

export const GroupMessage: React.FC<GroupMessageProps> = ({
  messageId,
  message,
  groupId,
  user,
  byLocalUser,
  hasMessageAbove,
  hasMessageBelow,
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

  const copyMessage = () => {
    navigator.clipboard.writeText(message)

    toast.success("Message copied to clipboard")
  }

  return (
    <div className="flex flex-col w-full">
      {!byLocalUser && !hasMessageAbove && (
        <div className="flex items-center space-x-2">
          <Avatar className="h-4 w-4">
            <AvatarImage src={user?.avatar_url ?? undefined} />
            <AvatarFallback>{user?.full_name}</AvatarFallback>
          </Avatar>

          <p className="my-0">{user?.full_name}</p>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-center gap-2 group",
              byLocalUser ? "self-end" : "self-start flex-row-reverse"
            )}
          >
            <Button variant="ghost" size="icon" className="hidden group-hover:inline-flex">
              <MoreVerticalIcon className="w-5 h-5 text-foreground" />
            </Button>

            <p
              className={cn(
                "p-3 w-fit rounded-2xl",
                byLocalUser ? "bg-primary text-primary-foreground" : "border border-border",
                messageCorners(),
                margins()
              )}
            >
              {message}
            </p>
          </div>
        </DropdownMenuTrigger>
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
    </div>
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
                  return toast.error("Message is the same as the current message")
                }

                const result = await editMessageWithId(formData)
                if (result?.errorMessage) {
                  return toast.error(result.errorMessage)
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
