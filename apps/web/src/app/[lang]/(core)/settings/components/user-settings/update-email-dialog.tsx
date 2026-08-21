"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import {
  closeDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { toast } from "@workspace/ui/components/toast"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"
import { updateUserEmail } from "@/app/actions/userActions"
import { useInfoDialog } from "@/hooks/use-info-dialog"
import { updateEmailSchema, UpdateEmailSchemaValues } from "@/lib/schemas/user-schemas"

interface UpdateEmailDialogProps {
  currentEmail?: string
  children: React.ReactNode
}

export const UpdateEmailDialog: React.FC<UpdateEmailDialogProps> = ({ currentEmail, children }) => {
  const t = useTranslations("SettingsPage.user.updateEmail")
  const [InfoDialog, openInfoDialog] = useInfoDialog()

  const { isPending, execute } = useServerAction(updateUserEmail, {
    onError: ({ err }) => {
      toast.add({ type: "error", description: err.message })
    },
    onSuccess: () => {
      closeDialog()
      openInfoDialog()
    },
  })

  const form = useForm<UpdateEmailSchemaValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: "",
      confirmEmail: "",
    },
  })

  return (
    <>
      <InfoDialog title={t("infoDialogTitle")} message={t("infoDialogDescription")} />
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialogTitle")}</DialogTitle>
            <DialogDescription className="pt-1">
              {t.rich("dialogDescription", {
                currentEmail: currentEmail ?? t("noEmail"),
                b: (chunks) => <b>{chunks}</b>,
              })}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex w-full flex-col gap-y-4"
              onSubmit={form.handleSubmit((values) => execute(values))}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newEmail")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t("newEmailPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmEmail")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t("confirmEmailPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-fit self-end"
              >
                {isPending ? t("dialogSubmitButton.loading") : t("dialogSubmitButton.default")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
