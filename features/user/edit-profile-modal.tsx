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
import { updateProfileSchema, UpdateProfileSchemaValues } from "@/lib/schemas/user-schemas"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { UserEditableAvatar } from "@/app/components/user/user-editable-avatar"
import { useUpdateProfileMutation } from "@/features/user/useUpdateProfileMutation"
import { ZSAError } from "zsa"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { removeUserAvatar } from "@/app/actions/userActions"
import { useTranslations } from "next-intl"

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
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">{t("header")}</DialogTitle>
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
    toast.loading("Removing avatar...", { id: "remove-avatar" })
    changeCanClose(false)

    const [_, error] = await removeUserAvatar()
    changeCanClose(true)

    if (error) {
      toast.error("Failed to remove avatar", { id: "remove-avatar" })
    } else {
      toast.success("Avatar removed", { id: "remove-avatar" })
      queryClient.invalidateQueries({ queryKey: ["posts", user.id] })
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col mt-4 gap-y-4 w-full"
          onSubmit={form.handleSubmit((values) => {
            if (form.formState.isDirty) {
              toast.loading("Saving changes...", { id: "edit-profile" })
              changeCanClose(false)

              mutate(
                { values },
                {
                  onSuccess: () => {
                    toast.success(t("success"), { id: "edit-profile" })
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

                    console.error(err)

                    toast.error(err.message, { id: "edit-profile" })
                    changeCanClose(true)
                  },
                }
              )
            }
          })}
        >
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="self-center flex flex-col items-center">
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
                  <Input
                    className="border-none"
                    placeholder={t("username")}
                    startAdornment={<span>@</span>}
                    {...field}
                  />
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
                  <Textarea className="border-none resize-none" placeholder="Bio" {...field} />
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
