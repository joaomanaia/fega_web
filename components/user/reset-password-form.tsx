"use client"

import { resetPasswordAction } from "@/app/[lang]/(auth)/actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { resetPasswordSchema, type ResetPasswordSchemaValues } from "@/lib/schemas/user-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function ResetPasswordForm() {
  const t = useTranslations("AuthPage")

  const { isPending, execute } = useAction(resetPasswordAction, {
    onSuccess: () => {
      toast.success("Password reset successfully. ")
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "An error occurred while processing your request.")
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
      <form className="space-y-6 w-full" onSubmit={form.handleSubmit(execute)}>
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
