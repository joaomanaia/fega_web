"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { forgotPasswordAction } from "@/app/[lang]/auth/actions"
import { forgotPasswordSchema, type ForgotPasswordActionValues } from "@/lib/schemas/auth-schemas"
import { Link } from "@/src/i18n/navigation"

export default function ForgotPasswordForm() {
  const t = useTranslations("AuthPage")

  const { isPending, execute } = useAction(forgotPasswordAction, {
    onSuccess: () => {
      toast.success(t("forgotPasswordSuccess"))
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "An error occurred while processing your request.")
    },
  })

  const form = useForm<ForgotPasswordActionValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input className="border-none" placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormDescription>{t("forgotPasswordDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {t("forgotPasswordButton")}
        </Button>
        <div className="text-center text-sm">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            {t("loginButton")}
          </Link>
        </div>
      </form>
    </Form>
  )
}
