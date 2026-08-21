"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "@workspace/ui/components/toast"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { ZSAError } from "zsa"
import { removeUserAvatar } from "@/app/actions/userActions"
import { UserEditableAvatar } from "@/app/components/user/user-editable-avatar"
import { useUpdateProfileMutation } from "@/features/user/useUpdateProfileMutation"
import { useModal } from "@/hooks/use-modal-store"
import { updateProfileSchema, UpdateProfileSchemaValues } from "@/lib/schemas/user-schemas"
import type UserType from "@/types/UserType"

export const EditProfileModal: React.FC = () => {
  const {
    isOpen,
    onClose,
    data: { user },
  } = useModal("edit-profile")

  // When the profile is updating, we don't want the user to close the modal
  const [canClose, setCanClose] = useState(true)
  const t = useTranslations("User.editProfile")

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => canClose && onClose()}>
      <DialogContent>
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">{t("header")}</DialogTitle>
        </DialogHeader>
        <EditProfileForm user={user} onClose={onClose} changeCanClose={setCanClose} />
      </DialogContent>
    </Dialog>
  )
}

interface EditProfileFormProps {
  user: UserType
  onClose: () => void
  changeCanClose: (canClose: boolean) => void
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onClose,
  changeCanClose,
}) => {
  const t = useTranslations("User.editProfile")

  const form = useForm<UpdateProfileSchemaValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user.username,
      full_name: user.full_name ?? "",
      bio: user.bio ?? "",
      avatar: user.avatar_url,
    },
  })

  const { mutate, isPending } = useUpdateProfileMutation(user.id)
  const queryClient = useQueryClient()

  const handleRemoveAvatar = async () => {
    toast.add({ type: "loading", description: "Removing avatar...", id: "remove-avatar" })
    changeCanClose(false)

    const [_, error] = await removeUserAvatar()
    changeCanClose(true)

    if (error) {
      toast.update("remove-avatar", { type: "error", description: "Failed to remove avatar" })
    } else {
      toast.update("remove-avatar", { type: "success", description: "Avatar removed" })
      queryClient.invalidateQueries({ queryKey: ["posts", user.id] })
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          className="mt-4 flex w-full flex-col gap-y-4"
          onSubmit={form.handleSubmit((values) => {
            if (form.formState.isDirty) {
              toast.add({ type: "loading", description: "Saving changes...", id: "edit-profile" })
              changeCanClose(false)

              mutate(
                { values },
                {
                  onSuccess: () => {
                    toast.update("edit-profile", { type: "success", description: t("success") })
                    queryClient.invalidateQueries({ queryKey: ["posts", user.id] })
                    changeCanClose(true)
                    onClose()
                  },
                  onError: (err) => {
                    const zsaError = err as ZSAError | undefined
                    if (zsaError !== undefined) {
                      if (zsaError.code === "CONFLICT") {
                        form.setError("username", {
                          type: "manual",
                          message: "Username is already taken",
                        })
                      }
                    }

                    toast.update("edit-profile", { type: "error", description: err.message })
                    changeCanClose(true)
                  },
                },
              )
            }
          })}
        >
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center self-center">
                <FormControl>
                  <UserEditableAvatar
                    avatar={field.value}
                    onAvatarChange={(blob) =>
                      field.onChange(blob ? URL.createObjectURL(blob) : null)
                    }
                    onRemoveAvatarRequest={handleRemoveAvatar}
                    currentAvatar={user.avatar_url}
                    name={user.full_name}
                    className="self-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("username")}</FormLabel>
                <FormControl>
                  <InputGroup className="border-none">
                    <InputGroupInput id="username" placeholder={t("username")} {...field} />
                    <InputGroupAddon>
                      <Label htmlFor="username">@</Label>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fullName")}</FormLabel>
                <FormControl>
                  <Input className="border-none" placeholder={t("fullName")} {...field} />
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
                  <Textarea className="resize-none border-none" placeholder="Bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            {/* Disabled when pending or form is not changed */}
            <Button disabled={isPending || !form.formState.isDirty}>{t("save")}</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
