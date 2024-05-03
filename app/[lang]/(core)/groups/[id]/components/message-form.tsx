"use client"

import sendGroupMessage from "@/core/actions/group/sendGroupMessage"
import { EmojiPicker } from "./emoji-picker"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import ReplyToType from "@/types/ReplyToType"
import { cn } from "@/lib/utils"
import { Hint } from "@/components/hint"
import SendMessageButton from "@/app/components/message/SendMessageButton"

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
        className="flex space-x-2 w-full items-end justify-center"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <div className="flex space-x-2 items-end justify-center">
                  <EmojiPicker
                    onEmojiClick={(emoji) => field.onChange(`${field.value} ${emoji}`)}
                  />
                  <div className="flex flex-col grow">
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

        {form.getValues("message") && <SendMessageButton className="rounded-2xl size-11" />}
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
      <div className="flex items-center space-x-2 rounded-t-md pl-3 pr-1 py-2 bg-surfaceVariant dark:bg-surfaceVariant/20">
        <div className="flex flex-col grow justify-center space-y-1">
          <p className="text-sm">
            Replying to <span className="font-bold">{replyTo.replyToName}</span>
          </p>
          <p className="text-xs truncate">{replyTo.message}</p>
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
