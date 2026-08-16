"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { createGroup } from "@/app/actions/group/groupActions"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { useModal } from "@/hooks/use-modal-store"
import { useRouter } from "@/i18n/navigation"
import { createGroupSchema, type CreateGroupSchemaValues } from "@/lib/schemas/group-schemas"

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
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("description")}</DialogDescription>
        <Form {...form}>
          <form
            className="mt-4 flex w-full flex-col gap-y-4"
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
                  <div className="flex items-center gap-4">
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
