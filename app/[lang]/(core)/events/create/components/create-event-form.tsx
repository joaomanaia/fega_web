"use client"

import { FileUpload } from "@/components/file-upload"
import { MdxEditor } from "@/components/mdx-editor"
import { AsyncCreatableSelect } from "@/components/select/select-creatable"
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
import type { CalendarEventOtherDataItem, CalendarEventOtherDataType } from "@/types/CalendarEvent"
import type { Database } from "@/types/database.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { CalendarIcon, TrashIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useDebounceCallback } from "usehooks-ts"
import { z } from "zod"
import { MoreInfo } from "../../[event_id]/components/more-info"
import { Select } from "@/components/select/select"
import { useState } from "react"
import { createEvent } from "@/app/actions/calendarEventActions"

interface CreateEventFormProps {
  className?: string
}

const formSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImage: z.string().url(),
  content: z.string(),
  fromDate: z.date({
    required_error: "From date is required",
  }),
  toDate: z.date({
    required_error: "To date is required",
  }),
  locationId: z.string().nullable().optional(),
  otherData: z.custom<CalendarEventOtherDataItem>().array(),
})

type Option = {
  value: string
  label: string
}

const otherDataOptions: Option[] = [
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "price", label: "Price" },
  { value: "other", label: "Other" },
]

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ className }) => {
  const { onOpen } = useModal()

  const [selectedOtherDataOption, setSelectedOtherDataOption] = useState<string | null>(null)

  const supabase = createClientComponentClient<Database>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
      content: "",
      otherData: [],
    },
  })

  const loadLocations = useDebounceCallback(async (inputValue: string) => {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .ilike("name", `%${inputValue}%`)
      .limit(10)

    if (error) {
      toast.error("Something went wrong")
      return []
    }

    const locations: Option[] =
      data.map((location) => ({
        value: String(location.id),
        label: `${location.name} - ${location.address}`,
      })) ?? []

    return locations
  }, 500)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    try {
      await createEvent(values)
      toast.success("Event created successfully")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Something went wrong")
      }
    }
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
                <AsyncCreatableSelect
                  className="min-w-[280px] w-full"
                  placeholder="Select a location"
                  options={[]}
                  onCreate={(locationName) => onOpen("create-location", { locationName })}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                  promiseOptions={(inputValue) => loadLocations(inputValue) ?? Promise.resolve([])}
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

        <FormField
          control={form.control}
          name="otherData"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  {field.value && (
                    <MoreInfo
                      data={field.value}
                      className="group"
                      itemPrefixContent={(dataItem) => (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="text-foreground"
                            onClick={() => {
                              field.onChange(field.value.filter((item) => item !== dataItem))
                            }}
                          >
                            <TrashIcon />
                          </Button>
                          <span className="text-foreground/40">&bull;</span>
                        </>
                      )}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <Select
                      className="w-[280px]"
                      placeholder="Other data type"
                      options={otherDataOptions}
                      value={selectedOtherDataOption}
                      onChange={(option) => {
                        if (option) {
                          setSelectedOtherDataOption(option)
                        }
                      }}
                    />
                    <Input
                      placeholder="Enter other information"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()

                          field.onChange([
                            ...field.value,
                            {
                              type: selectedOtherDataOption ?? "other",
                              value: e.currentTarget.value,
                            },
                          ])
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>
                </>
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
