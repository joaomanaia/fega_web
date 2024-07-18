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
import type UserType from "@/types/UserType"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { SubmitButton } from "@/components/submit-button"
import { type Dictionary } from "@/get-dictionary"

interface EditProfileFormProps {
  user: UserType
  dictionary: Dictionary
}

const formSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(30, "Full name must be at most 30 characters long"),
  bio: z.string().max(160, "Bio must be at most 160 characters long"),
})

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, dictionary }) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
      bio: user.bio ?? "",
    },
  })

  return (
    <>
      <Form {...form}>
        <form
          action={async (formData: FormData) => {
            // Check if the changes are not the same as the current user
            const hasFullNameChanged = formData.get("full_name") !== user.full_name
            const hasBioChanged = formData.get("bio") !== user.bio

            if (!hasFullNameChanged && !hasBioChanged) {
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
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.editProfile.fullName}</FormLabel>
                <FormControl>
                  <Input
                    className="border-none"
                    placeholder={dictionary.editProfile.fullName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input
                    className="border-none"
                    placeholder="Bio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <SubmitButton>{dictionary.saveChanges}</SubmitButton>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
