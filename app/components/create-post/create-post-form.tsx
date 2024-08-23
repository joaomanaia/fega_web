"use client"

import { CreatePostButton } from "@/app/components/create-post/create-post-button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPost } from "@/core/actions/postActions"
import { type Dictionary } from "@/get-dictionary"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface CreatePostFormProps {
  className?: string
  dictionary: Dictionary["post"]["create"]
}

const formSchema = z.object({
  description: z.string().min(1).max(500),
})

type FormValues = z.infer<typeof formSchema>

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ className, dictionary }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      await createPost(values.description)

      toast.success(dictionary.success)
    } catch (error) {
      toast.error(dictionary.error)
    } finally {
      form.reset()
    }
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
        <CreatePostButton
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          dictionary={dictionary.submitButton}
        />
      </form>
    </Form>
  )
}
