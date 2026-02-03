"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import SendMessageButton from "@/app/components/message/SendMessageButton"
import { Hint } from "@/components/hint"
import sendGroupMessage from "@/core/actions/group/sendGroupMessage"
import { cn } from "@/lib/utils"
import ReplyToType from "@/types/ReplyToType"
import { EmojiPicker } from "./emoji-picker"

interface GroupMessageFormProps {
  groupId: string
  groupName: string
  replyTo?: ReplyToType | null
  clearReplyTo: () => void
}

const formSchema = z.object({
  message: z.string().min(1).max(512),
})

const GroupMessageForm: React.FC<GroupMessageFormProps> = ({
  groupId,
  groupName,
  replyTo,
  clearReplyTo,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form
        action={async (formData) => {
          const message = formData.get("message") as string | undefined
          if (!message) return

          // Reset the form
          form.reset()
          clearReplyTo()

          await sendGroupMessage(groupId, message, replyTo?.messageId)
        }}
        className="flex w-full items-end justify-center space-x-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <div className="flex items-end justify-center space-x-2">
                  <EmojiPicker
                    onEmojiClick={(emoji) => field.onChange(`${field.value} ${emoji}`)}
                  />
                  <div className="flex grow flex-col">
                    {replyTo && <ReplyContent replyTo={replyTo} clearReplyTo={clearReplyTo} />}
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder={`Message to ${groupName}`}
                      required
                      maxLength={512}
                      className={cn("h-11", replyTo && "rounded-t-none")}
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("message") && <SendMessageButton className="size-11 rounded-2xl" />}
      </form>
    </Form>
  )
}

export default GroupMessageForm

interface ReplyContentProps {
  replyTo: ReplyToType
  clearReplyTo: () => void
}

const ReplyContent: React.FC<ReplyContentProps> = ({ replyTo, clearReplyTo }) => {
  return (
    <>
      <div className="bg-surface-variant dark:bg-surface-variant/20 flex items-center space-x-2 rounded-t-md py-2 pr-1 pl-3">
        <div className="flex grow flex-col justify-center space-y-1">
          <p className="text-sm">
            Replying to <span className="font-bold">{replyTo.replyToName}</span>
          </p>
          <p className="truncate text-xs">{replyTo.message}</p>
        </div>

        <Hint label="Clear reply" side="top" align="end">
          <Button
            className="text-foreground bg-transparent"
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearReplyTo}
          >
            <XIcon />
          </Button>
        </Hint>
      </div>
    </>
  )
}
