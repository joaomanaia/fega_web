"use client"

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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SignInActionValues, signInSchema } from "@/lib/schemas/auth-schemas"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { signInAction } from "@/app/[lang]/(auth)/actions"
import { Link } from "@/components/link"
import type { Locale } from "@/i18n-config"
import type { Dictionary } from "@/get-dictionary"
import { sendGTMEvent } from "@next/third-parties/google"

interface LoginFormProps {
  lang: Locale
  authDictionary: Dictionary["page"]["auth"]
}

export function LoginForm({ lang, authDictionary }: LoginFormProps) {
  const { isPending, execute } = useAction(signInAction, {
    onSuccess: () => {
      toast.success("Login successful!")
      sendGTMEvent({ event: "login", method: "email" })
    },
    onError: () => {
      toast.error("Login failed")
    },
  })

  const form = useForm<SignInActionValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="space-y-6 w-full">
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
                <FormLabel>{authDictionary.password}</FormLabel>
                <Link
                  href="/forgot-password"
                  lang={lang}
                  className="text-sm hover:underline underline-offset-4"
                >
                  {authDictionary.forgotPassword}
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  className="border-none"
                  placeholder={authDictionary.passwordPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {authDictionary.loginButton}
        </Button>
        <div className="text-center text-sm">
          {authDictionary.dontHaveAccount}{" "}
          <Link href="/signup" lang={lang} className="underline underline-offset-4">
            {authDictionary.registerButton}
          </Link>
        </div>
      </form>
    </Form>
  )
}
