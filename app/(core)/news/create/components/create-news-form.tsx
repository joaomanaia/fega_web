"use client"

import { createNews } from "@/app/actions/news/newsActions"
import { FileUpload } from "@/components/file-upload"
import { MdxEditor } from "@/components/mdx-editor"
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
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface CreateNewsFormProps {
  className?: string
}

const formSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url(),
  content: z.string().min(1).max(10000),
})

export const CreateNewsForm: React.FC<CreateNewsFormProps> = ({ className }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      content: "",
    },
  })

  return (
    <Form {...form}>
      <form
        action={async (formData: FormData) => {
          // ? This is a workaround because the imageUrl from formData is not being set
          formData.set("imageUrl", form.getValues("imageUrl"))

          try {
            await createNews(formData)
            toast.success("News created successfully")
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message)
            } else {
              toast.error("Something went wrong")
            }
          }
        }}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>News Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter news title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                News Description <span className="text-xs text-foreground/50">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter news description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>News Image</FormLabel>
              <FormControl>
                <FileUpload
                  endpoint="newsImage"
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full lg:w-1/2 aspect-video rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MdxEditor
                  className="w-full h-[700px] max-h-full"
                  maxLength={10000}
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create News</Button>
      </form>
    </Form>
  )
}
