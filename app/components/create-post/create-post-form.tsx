"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPost } from "@/core/actions/postActions"
import { createPostSchema, type CreatePostSchemaValues } from "@/lib/schemas/post-schemas"
import { cn } from "@/lib/utils"

interface CreatePostFormProps {
  className?: string
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ className }) => {
  const queryClient = useQueryClient()
  const t = useTranslations("Post.create")

  const { execute, isPending } = useAction(createPost, {
    onExecute: () => {
      form.reset()
      toast.loading(t("submitButton.loading"), { description: undefined, id: "create-post" })
    },
    onSuccess: () => {
      toast.success(t("success"), { id: "create-post" })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: ({ error }) => {
      toast.error(t("error"), {
        description: error.serverError,
        id: "create-post",
      })
    },
  })

  const form = useForm<CreatePostSchemaValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      description: "",
    },
  })

  return (
    <Form {...form}>
      <form className={cn("flex flex-col gap-4", className)} onSubmit={form.handleSubmit(execute)}>
        <h3 className="mt-4 mb-0 text-2xl">{t("header")}</h3>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="border-none py-6 ring-0"
                  placeholder={t("placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending || !form.formState.isValid}
          variant="default"
          type="submit"
          className="w-full"
        >
          {isPending ? t("submitButton.loading") : t("submitButton.default")}
        </Button>
      </form>
    </Form>
  )
}
