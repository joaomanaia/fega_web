"use server"

import { getLocale } from "next-intl/server"
import * as z from "zod"
import { redirect } from "@/i18n/navigation"
import { ActionError, authActionClient } from "@/lib/safe-action"
import type { CalendarEventOtherDataItem } from "@/types/CalendarEvent"
import type { Json } from "@/types/database.types"

export const createEventFormSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImage: z.url(),
  content: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  locationId: z.string().nullable().optional(),
  otherData: z.array(z.custom<CalendarEventOtherDataItem>()),
})

export type CreateEventFormValues = z.infer<typeof createEventFormSchema>

export const createEvent = authActionClient
  .metadata({ actionName: "createEvent" })
  .inputSchema(createEventFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx

    const { error } = await supabase.from("calendar_events").insert({
      content: parsedInput.content,
      cover_image: parsedInput.coverImage,
      description: parsedInput.description,
      start_date: parsedInput.fromDate.toISOString(),
      end_date: parsedInput.toDate.toISOString(),
      title: parsedInput.title,
      other_data: parsedInput.otherData as unknown as Json,
      location: parsedInput.locationId ? Number(parsedInput.locationId) : null,
    })

    if (error) {
      throw new ActionError(error.message, { cause: error })
    }

    redirect({ href: "/events", locale: await getLocale() })
  })

