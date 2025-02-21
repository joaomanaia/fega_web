"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPost } from "@/core/actions/postActions"
import { type Dictionary } from "@/get-dictionary"
import { createPostSchema, type CreatePostSchemaValues } from "@/lib/schemas/post-schemas"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

interface CreatePostFormProps {
  className?: string
  dictionary: Dictionary["post"]["create"]
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ className, dictionary }) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { execute, isPending } = useServerAction(createPost, {
    onSuccess: () => {
      toast.success(dictionary.success, { id: "create-post" })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: ({ err }) => {
      toast.error(dictionary.error, { id: "create-post" })

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
    toast.loading(dictionary.submitButton.loading, { id: "create-post" })
    await execute(values)
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h3 className="text-2xl mt-4 mb-0">{dictionary.header}</h3>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="py-6 border-none ring-0"
                  placeholder={dictionary.placeholder}
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
          {isPending ? dictionary.submitButton.loading : dictionary.submitButton.default}
        </Button>
      </form>
    </Form>
  )
}
