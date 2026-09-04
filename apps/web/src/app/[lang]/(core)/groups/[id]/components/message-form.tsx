"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Form, FormControl, FormField, FormItem } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"
import SendMessageButton from "@/app/components/message/SendMessageButton"
import { Hint } from "@/components/hint"
import sendGroupMessage from "@/core/actions/group/sendGroupMessage"
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
  const t = useTranslations("GroupsPage.messageForm")

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
                    {replyTo && (
                      <div className="animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <ReplyContent replyTo={replyTo} clearReplyTo={clearReplyTo} />
                      </div>
                    )}
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder={t("placeholder", { groupName })}
                      required
                      maxLength={512}
                      className={cn(
                        "h-11 rounded-md transition-[border-radius] duration-200 ease-out",
                        replyTo && "rounded-t-none",
                      )}
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

function ReplyContent({ replyTo, clearReplyTo }: ReplyContentProps) {
  const t = useTranslations("GroupsPage.messageForm")

  return (
    <div className="bg-surface flex items-center space-x-2 rounded-t-md border border-b-0 py-2 pr-1 pl-3">
      <div className="flex grow flex-col justify-center space-y-1">
        <p className="text-sm">
          {t.rich("replyingTo", {
            name: replyTo.replyToName,
            b: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </p>
        <p className="truncate text-xs">{replyTo.message}</p>
      </div>

      <Hint
        label={t("clearReply")}
        side="top"
        align="end"
        render={<Button type="button" variant="ghost" size="icon" onClick={clearReplyTo} />}
      >
        <XIcon />
      </Hint>
    </div>
  )
}
