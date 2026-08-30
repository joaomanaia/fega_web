"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
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
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { resetPasswordAction } from "@/app/[lang]/auth/actions"
import { resetPasswordSchema, type ResetPasswordSchemaValues } from "@/lib/schemas/user-schemas"

export default function ResetPasswordForm() {
  const t = useTranslations("AuthPage")

  const { isPending, execute } = useAction(resetPasswordAction, {
    onSuccess: () => {
      toast.add({ type: "success", description: "Password reset successfully." })
    },
    onError: ({ error }) => {
      toast.add({
        type: "error",
        description: error.serverError?.message ?? "An error occurred while processing your request.",
      })
    },
  })

  const form = useForm<ResetPasswordSchemaValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  return (
    <Form {...form}>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(execute)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t("passwordPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("passwordConfirmation")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("passwordConfirmationPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {t("resetPassword")}
        </Button>
      </form>
    </Form>
  )
}
