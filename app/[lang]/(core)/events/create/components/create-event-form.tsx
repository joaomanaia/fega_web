"use client"

import { FileUpload } from "@/components/file-upload"
import { MdxEditor } from "@/components/mdx-editor"
import { Select } from "@/components/select"
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
import { TimePickerPopover } from "@/components/ui/time-picker/time-picker-popover"
import { useModal } from "@/hooks/use-modal-store"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface CreateEventFormProps {
  className?: string
}

const formSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImage: z.string().url(),
  content: z.string().min(1).max(10000),
  fromDate: z.date({
    required_error: "From date is required",
  }),
  toDate: z.date({
    required_error: "To date is required",
  }),
  locationId: z.string().nullable().optional(),
})

type Option = {
  value: string
  label: string
}

const locationsOptions: Option[] = [
  { value: "1", label: "Location 1" },
  { value: "2", label: "Location 2" },
]

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ className }) => {
  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
      content: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        /*
        action={async (formData: FormData) => {
          // ? This is a workaround because the coverImage from formData is not being set
          formData.set("coverImage", form.getValues("coverImage"))

          try {
            // await createNews(formData)
            toast.success("News created successfully")
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message)
            } else {
              toast.error("Something went wrong")
            }
          }
        }}
        */
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
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
                Event Description <span className="text-xs text-foreground/50">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-4">
          <FormField
            control={form.control}
            name="fromDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left">From Date</FormLabel>
                <TimePickerPopover value={field.value} onChange={field.onChange}>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] rounded-2xl justify-start text-left font-normal text-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP HH:mm:ss") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </TimePickerPopover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left">To Date</FormLabel>
                <TimePickerPopover value={field.value} onChange={field.onChange}>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] rounded-2xl justify-start text-left font-normal text-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP HH:mm:ss") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </TimePickerPopover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Location</FormLabel>
              <FormControl>
                <Select
                  className="w-[280px]"
                  placeholder="Select a location"
                  options={locationsOptions}
                  onCreate={(locationName) => onOpen("create-location", { locationName })}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <FileUpload
                  endpoint="eventCoverImage"
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

        <Button type="submit">Create Event</Button>
      </form>
    </Form>
  )
}
