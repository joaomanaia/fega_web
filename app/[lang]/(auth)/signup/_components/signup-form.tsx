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
import { useServerAction } from "zsa-react"
import { toast } from "sonner"
import { signUpAction } from "@/app/[lang]/(auth)/actions"
import { type SignUpActionValues, signUpSchema } from "@/lib/schemas/auth-schemas"
import type { Locale } from "@/i18n-config"
import { Link } from "@/components/link"
import { ZSAError } from "zsa"
import type { Dictionary } from "@/get-dictionary"

interface SignUpFormProps {
  lang: Locale
  authDictionary: Dictionary["page"]["auth"]
}

export function SignUpForm({ lang, authDictionary }: SignUpFormProps) {
  const { isPending, execute } = useServerAction(signUpAction)

  const form = useForm<SignUpActionValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const [_, err] = await execute(values)

          if (err) {
            const zsaError = err as ZSAError | undefined
            if (zsaError !== undefined) {
              if (zsaError.code === "CONFLICT") {
                form.setError("username", {
                  type: "manual",
                  message: "Username is already taken",
                })
              }
            }

            toast.error(err.message)
          }
        })}
        className="space-y-6 w-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{authDictionary.username}</FormLabel>
              <FormControl>
                <Input
                  className="border-none"
                  placeholder={authDictionary.usernamePlaceholder}
                  startAdornment={<span>@</span>}
                  {...field}
                />
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
              <FormLabel>{authDictionary.fullName}</FormLabel>
              <FormControl>
                <Input
                  className="border-none"
                  placeholder={authDictionary.fullNamePlaceholder}
                  {...field}
                />
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
              <FormLabel>{authDictionary.password}</FormLabel>
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
          {authDictionary.registerButton}
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
