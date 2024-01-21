"use client"

import saveProfile from "@/app/actions/user/saveProfileAction"
import { DialogFooter, closeDialog } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import UserType from "@/types/UserType"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { SubmitButton } from "../../components/SubmitButton"

interface EditProfileFormProps {
  user: UserType
}

const formSchema = z.object({
  full_name: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(255, "Full name must be at most 255 characters long"),
})

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
    },
  })

  return (
    <>
      <Form {...form}>
        <form
          action={async (formData: FormData) => {
            // Check if the changes are not the same as the current user
            if (formData.get("full_name") === user.full_name) {
              return toast({
                variant: "default",
                title: "No changes detected.",
                description: "You haven't changed anything.",
              })
            }

            const result = await saveProfile(formData)

            if (result.fullNameErrorMessage) {
              return form.setError("full_name", {
                type: "manual",
                message: result.fullNameErrorMessage,
              })
            }

            if (result.errorMessage) {
              return toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: result.errorMessage,
              })
            }

            toast({
              variant: "default",
              title: "Profile updated!",
            })

            closeDialog()
          }}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <SubmitButton>Save changes</SubmitButton>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
