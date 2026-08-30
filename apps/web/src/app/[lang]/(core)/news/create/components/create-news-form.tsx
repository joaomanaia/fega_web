"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createNews } from "@/app/actions/news/newsActions"
import { FileUpload } from "@/components/file-upload"
import { MdxEditor } from "@/components/mdx-editor"

interface CreateNewsFormProps {
  className?: string
}

const formSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.url(),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createNews(values)
      if (result?.serverError) {
        toast.add({ type: "error", description: result.serverError.message })
        return
      }
      toast.add({ type: "success", description: "News created successfully" })
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ type: "error", description: error.message })
      } else {
        toast.add({ type: "error", description: "Something went wrong" })
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                News Description <span className="text-foreground/50 text-xs">(Optional)</span>
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
                  className="aspect-video w-full rounded-xl lg:w-1/2"
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
                  className="h-[700px] max-h-full w-full"
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
