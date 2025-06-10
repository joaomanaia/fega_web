"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPost } from "@/core/actions/postActions"
import { createPostSchema, type CreatePostSchemaValues } from "@/lib/schemas/post-schemas"
import { cn } from "@/lib/utils"
import { useRouter } from "@/src/i18n/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

interface CreatePostFormProps {
  className?: string
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ className }) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTranslations("Post.create")

  const { execute, isPending } = useServerAction(createPost, {
    onSuccess: () => {
      toast.success(t("success"), { id: "create-post" })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: ({ err }) => {
      toast.error(t("error"), { id: "create-post" })

      if (err.code === "NOT_AUTHORIZED") {
        router.push("/login")
      }
    },
  })

  const form = useForm<CreatePostSchemaValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      description: "",
    },
  })

  const handleSubmit = async (values: CreatePostSchemaValues) => {
    form.reset()
    toast.loading(t("submitButton.loading"), { id: "create-post" })
    await execute(values)
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h3 className="text-2xl mt-4 mb-0">{t("header")}</h3>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="py-6 border-none ring-0"
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
          color="primary"
          type="submit"
          className="w-full"
        >
          {isPending ? t("submitButton.loading") : t("submitButton.default")}
        </Button>
      </form>
    </Form>
  )
}
