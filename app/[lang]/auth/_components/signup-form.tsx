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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { signUpAction } from "@/app/[lang]/auth/actions"
import { signUpSchema } from "@/lib/schemas/auth-schemas"
import { Link } from "@/src/i18n/navigation"

export function SignUpForm() {
  const t = useTranslations("AuthPage")

  const {
    action: { isPending },
    form,
    handleSubmitWithAction,
  } = useHookFormAction(signUpAction, zodResolver(signUpSchema), {
    actionProps: {
      onExecute: () => {
        toast.loading("Creating account...", { id: "signup" })
      },
      onNavigation: () => {
        toast.success("Account created successfully!", { id: "signup" })
        sendGTMEvent({ event: "sign_up", method: "email" })
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "An error occurred while processing your request.", {
          id: "signup",
        })
      },
    },
    formProps: {
      defaultValues: {
        username: "",
        fullname: "",
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username")}</FormLabel>
              <FormControl>
                <InputGroup className="border-none">
                  <InputGroupInput
                    id="username"
                    placeholder={t("usernamePlaceholder")}
                    {...field}
                  />
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
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fullName")}</FormLabel>
              <FormControl>
                <Input className="border-none" placeholder={t("fullNamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel>{t("password")}</FormLabel>
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
          {t("registerButton")}
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
