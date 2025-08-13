"use server"

import { getLocale } from "next-intl/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/src/i18n/navigation"
import type { CalendarEventOtherDataItem } from "@/types/CalendarEvent"

const createEventFormSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImage: z.url(),
  content: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  locationId: z.string().nullable().optional(),
  otherData: z.custom<CalendarEventOtherDataItem>().array(),
})

export async function createEvent(values: z.infer<typeof createEventFormSchema>) {
  const supabase = await createClient()

  const { error } = await supabase.from("calendar_events").insert({
    content: values.content,
    cover_image: values.coverImage,
    description: values.description,
    start_date: values.fromDate.toISOString(),
    end_date: values.toDate.toISOString(),
    title: values.title,
    other_data: values.otherData,
    location: Number(values.locationId),
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect({ href: "/events", locale: await getLocale() })
}
