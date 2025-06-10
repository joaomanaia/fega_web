"use client"

import { createGroup } from "@/app/actions/group/groupActions"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useModal } from "@/hooks/use-modal-store"
import { createGroupSchema, type CreateGroupSchemaValues } from "@/lib/schemas/group-schemas"
import { useRouter } from "@/src/i18n/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

export const CreateGroupModal: React.FC = () => {
  const { isOpen, onClose } = useModal("create-group")
  const router = useRouter()

  const t = useTranslations("GroupsPage.create")

  const { isPending, execute } = useServerAction(createGroup, {
    onError: ({ err }) => {
      toast.error(err.message)
    },
    onSuccess: ({ data: id }) => {
      toast.success(t("success"))
      onClose()
      router.push(`/groups/${id}`)
    },
  })

  const form = useForm<CreateGroupSchemaValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      group_name: "",
      group_avatar: "",
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("description")}</DialogDescription>
        <Form {...form}>
          <form
            className="flex flex-col mt-4 gap-y-4 w-full"
            onSubmit={form.handleSubmit((values) => execute(values))}
          >
            <FormField
              control={form.control}
              name="group_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("groupName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("groupNamePlaceholder")} {...field} />
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
                  <FormLabel>{t("groupAvatarUrl")}</FormLabel>
                  <div className="flex gap-4 items-center">
                    <UserAvatar src={field.value} name={form.getValues("group_name")} />
                    <FormControl>
                      <Input placeholder={t("groupAvatarUrlPlaceholder")} {...field} />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="mt-4 min-w-28"
                disabled={isPending || !form.formState.isValid}
              >
                {t(isPending ? "submitButton.loading" : "submitButton.default")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
