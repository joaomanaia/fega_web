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
import type { Dictionary } from "@/get-dictionary"
import { resetPasswordSchema, type ResetPasswordSchemaValues } from "@/lib/schemas/user-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface ResetPasswordFormProps {
  authDictionary: Dictionary["page"]["auth"]
}

export default function ResetPasswordForm({ authDictionary }: ResetPasswordFormProps) {
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
              <FormLabel>{authDictionary.password}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={authDictionary.passwordPlaceholder}
                  {...field}
                />
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
              <FormLabel>{authDictionary.passwordConfirmation}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={authDictionary.passwordConfirmationPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {authDictionary.resetPassword}
        </Button>
      </form>
    </Form>
  )
}
