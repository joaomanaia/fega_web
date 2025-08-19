"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { sendGTMEvent } from "@next/third-parties/google"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
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
import { signInAction } from "@/app/[lang]/auth/actions"
import { signInSchema } from "@/lib/schemas/auth-schemas"
import { Link } from "@/src/i18n/navigation"

export function LoginForm() {
  const t = useTranslations("AuthPage")

  const {
    action: { isPending },
    form,
    handleSubmitWithAction,
  } = useHookFormAction(signInAction, zodResolver(signInSchema), {
    actionProps: {
      onNavigation: () => {
        toast.success("Login successful!")
        sendGTMEvent({ event: "login", method: "email" })
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Login failed")
      },
    },
    formProps: {
      defaultValues: {
        email: "",
        password: "",
      },
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input className="border-none" placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t("password")}</FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  className="border-none"
                  placeholder={t("passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {t("loginButton")}
        </Button>
        <div className="text-center text-sm">
          {t("dontHaveAccount")}{" "}
          <Link href="/auth/signup" className="underline underline-offset-4">
            {t("registerButton")}
          </Link>
        </div>
      </form>
    </Form>
  )
}
