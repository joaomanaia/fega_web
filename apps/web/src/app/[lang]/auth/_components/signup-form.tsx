"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { sendGTMEvent } from "@next/third-parties/google"
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group"
import { Label } from "@workspace/ui/components/label"
import { toast } from "@workspace/ui/components/toast"
import { useTranslations } from "next-intl"
import { signUpAction } from "@/app/[lang]/auth/actions"
import { Link } from "@/i18n/navigation"
import { signUpSchema } from "@/lib/schemas/auth-schemas"

export function SignUpForm() {
  const t = useTranslations("AuthPage")

  const {
    action: { isPending },
    form,
    handleSubmitWithAction,
  } = useHookFormAction(signUpAction, zodResolver(signUpSchema), {
    actionProps: {
      onExecute: () => {
        toast.add({ type: "loading", description: "Creating account...", id: "signup" })
      },
      onNavigation: () => {
        toast.update("signup", { type: "success", description: "Account created successfully!" })
        sendGTMEvent({ event: "sign_up", method: "email" })
      },
      onError: ({ error }) => {
        toast.update("signup", {
          type: "error",
          description: error.serverError?.message ?? "An error occurred while processing your request.",
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
