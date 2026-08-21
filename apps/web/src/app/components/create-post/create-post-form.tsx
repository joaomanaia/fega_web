"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { createPost } from "@/core/actions/postActions"
import { createPostSchema, type CreatePostSchemaValues } from "@/lib/schemas/post-schemas"

interface CreatePostFormProps {
  className?: string
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ className }) => {
  const queryClient = useQueryClient()
  const t = useTranslations("Post.create")

  const { execute, isPending } = useAction(createPost, {
    onExecute: () => {
      form.reset()
      toast.add({
        type: "loading",
        title: t("submitButton.loading"),
        description: undefined,
        id: "create-post",
      })
    },
    onSuccess: () => {
      toast.add({ title: t("success"), id: "create-post" })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: ({ error }) => {
      toast.add({
        type: "error",
        title: t("error"),
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
