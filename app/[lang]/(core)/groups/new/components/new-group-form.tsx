"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import BackButton from "./BackButton"
import { SubmitButton } from "@/components/submit-button"
import { createGroup } from "@/app/actions/groupActions"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { redirect } from "next/navigation"

interface NewGroupFormProps {}

const formSchema = z.object({
  group_name: z
    .string()
    .min(1, "Group name must be at least 1 characters long")
    .max(255, "Group name must be at most 255 characters long"),
  group_avatar: z.string().url().optional().or(z.literal("")),
})

export const NewGroupForm: React.FC<NewGroupFormProps> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_name: "",
    },
  })

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col mt-8 space-y-6 w-full"
          action={async (formData: FormData) => {
            const result = await createGroup(formData)

            if (result?.errorMessage) {
              toast.error(result.errorMessage)
            } else {
              toast.success("Group created")
              return redirect("/groups")
            }
          }}
        >
          <FormField
            control={form.control}
            name="group_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    required
                    className="w-full h-12"
                    placeholder="Group Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="group_avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Avatar URL</FormLabel>
                <div className="flex gap-4 items-center">
                  {field.value && (
                    <Avatar>
                      <AvatarImage src={field.value} />
                    </Avatar>
                  )}
                  <FormControl>
                    <Input className="w-full h-12" placeholder="Group Avatar URL" {...field} />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex self-end space-x-4">
            <BackButton />
            <SubmitButton>Create</SubmitButton>
          </div>
        </form>
      </Form>
    </>
  )
}
