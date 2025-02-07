"use client"

import { forgotPasswordAction } from "@/app/[lang]/(auth)/actions"
import { Link } from "@/components/link"
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
import type { Dictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import { type ForgotPasswordActionValues, forgotPasswordSchema } from "@/lib/schemas/auth-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

interface ForgotPasswordFormProps {
  lang: Locale
  authDictionary: Dictionary["page"]["auth"]
}

export default function ForgotPasswordForm({ lang, authDictionary }: ForgotPasswordFormProps) {
  const { isPending, execute } = useServerAction(forgotPasswordAction)

  const form = useForm<ForgotPasswordActionValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const [_, err] = await execute(values)

          if (err) {
            toast.error(err.message)
            return
          }

          toast.success(authDictionary.forgotPasswordSuccess, {
            duration: 5000,
          })
        })}
        className="space-y-6 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{authDictionary.email}</FormLabel>
              <FormControl>
                <Input
                  className="border-none"
                  placeholder={authDictionary.emailPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormDescription>{authDictionary.forgotPasswordDescription}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {authDictionary.forgotPasswordButton}
        </Button>
        <div className="text-center text-sm">
          {authDictionary.alreadyHaveAccount}{" "}
          <Link href="/login" lang={lang} className="underline underline-offset-4">
            {authDictionary.loginButton}
          </Link>
        </div>
      </form>
    </Form>
  )
}
