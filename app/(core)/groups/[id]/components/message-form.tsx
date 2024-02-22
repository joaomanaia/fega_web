"use client"

import SendMessageButton from "@/app/(core)/components/message/SendMessageButton"
import sendGroupMessage from "@/core/actions/group/sendGroupMessage"
import { EmojiPicker } from "./emoji-picker"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface GroupMessageFormProps {
  groupId: string
  groupName: string
}

const formSchema = z.object({
  message: z.string().min(1).max(512),
})

const GroupMessageForm: React.FC<GroupMessageFormProps> = ({ groupId, groupName }) => {
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

          await sendGroupMessage(groupId, message)
        }}
        className="flex space-x-2 w-full items-center justify-center"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <div className="flex space-x-2 items-center justify-center">
                  <EmojiPicker
                    onEmojiClick={(emoji) => field.onChange(`${field.value} ${emoji}`)}
                  />
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder={`Message to ${groupName}`}
                    required
                    maxLength={512}
                    className="h-11"
                    {...field}
                  />
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
