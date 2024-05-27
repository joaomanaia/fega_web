"use server"

import { createServerActionClient } from "@/supabase"
import type { CalendarEventOtherDataItem } from "@/types/CalendarEvent"
import { redirect } from "next/navigation"
import { z } from "zod"

const createEventFormSchema = z.object({
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

export async function createEvent(values: z.infer<typeof createEventFormSchema>) {
    console.log(values)
  /*
  const supabase = createServerActionClient()

  const otherDataParsed = JSON.stringify(values.otherData)

  const { error } = await supabase.from("calendar_events").insert({
    content: values.content,
    cover_image: values.coverImage,
    description: values.description,
    start_date: values.fromDate.toISOString(),
    end_date: values.toDate.toISOString(),
    title: values.title,
    other_data: otherDataParsed,
    location: Number(values.locationId),
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect("/events")
  */
}
