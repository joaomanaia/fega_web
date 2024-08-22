"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type UserType from "@/types/UserType"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type Dictionary } from "@/get-dictionary"
import { updateProfileSchema, UpdateProfileSchemaValues } from "@/lib/schemas/user-schemas"
import { Textarea } from "@/components/ui/textarea"
import { useServerAction } from "zsa-react"
import { updateUserProfile } from "@/app/actions/user/userActions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useDictionary } from "@/hooks/use-get-dictionary"
import { useModal } from "@/hooks/use-modal-store"

export const EditProfileModal: React.FC = () => {
  const {
    isOpen,
    onClose,
    data: { user },
  } = useModal("edit-profile")

  if (!user) return null

  const dictionary = useDictionary()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {dictionary.editProfile.header}
          </DialogTitle>
        </DialogHeader>
        <EditProfileForm user={user} dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  )
}

interface EditProfileFormProps {
  user: UserType
  dictionary: Dictionary
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, dictionary }) => {
  const { onClose } = useModal("edit-profile")

  const form = useForm<UpdateProfileSchemaValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
      bio: user.bio ?? "",
    },
  })

  const { isPending, execute } = useServerAction(updateUserProfile, {
    onError: ({ err }) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success(dictionary.editProfile.success)
      onClose()
    },
  })

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col mt-4 gap-y-4 w-full"
          onSubmit={form.handleSubmit((values) => {
            if (form.formState.isDirty) {
              execute(values)
            }
          })}
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
                  <Textarea className="border-none resize-none" placeholder="Bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            {/* Disabled when pending or form is not changed */}
            <Button disabled={isPending || !form.formState.isDirty}>
              {dictionary.saveChanges}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
