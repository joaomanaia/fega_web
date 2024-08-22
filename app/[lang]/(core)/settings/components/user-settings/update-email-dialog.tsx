"use client"

import { updateUserEmail } from "@/app/actions/userActions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  closeDialog,
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
import { Dictionary } from "@/get-dictionary"
import { useInfoDialog } from "@/hooks/use-info-dialog"
import { updateEmailSchema, UpdateEmailSchemaValues } from "@/lib/schemas/user-schemas"
import { formatString } from "@/src/util/dictionary-util"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

interface UpdateEmailDialogProps {
  currentEmail?: string
  dictionary: Dictionary["settings"]["user"]["updateEmail"]
  children: React.ReactNode
}

export const UpdateEmailDialog: React.FC<UpdateEmailDialogProps> = ({
  currentEmail,
  dictionary,
  children,
}) => {
  const [InfoDialog, openInfoDialog] = useInfoDialog()

  const { isPending, execute } = useServerAction(updateUserEmail, {
    onError: ({ err }) => {
      toast.error(err.message)
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
      <InfoDialog title={dictionary.infoDialogTitle} message={dictionary.infoDialogDescription} />
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dictionary.dialogTitle}</DialogTitle>
            <DialogDescription className="pt-1">
              {formatString(dictionary.dialogDescription, { currentEmail: <b>{currentEmail}</b> })}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-y-4 w-full"
              onSubmit={form.handleSubmit((values) => execute(values))}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.newEmail}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={dictionary.newEmailPlaceholder} {...field} />
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
                    <FormLabel>{dictionary.confirmEmail}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={dictionary.confirmEmailPlaceholder}
                        {...field}
                      />
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
                {isPending
                  ? dictionary.dialogSubmitButton.loading
                  : dictionary.dialogSubmitButton.default}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
