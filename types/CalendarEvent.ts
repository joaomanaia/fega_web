import type { Json, Tables } from "./database.types"
import type { Location } from "./location"

export type CalendarEvent = {
  id: string
  title: string
  description: string | null
  content: string
  coverImage: string
  startDate: Date
  endDate: Date
  location: Location | null
  otherData: CalendarEventOtherData
}

export type CalendarEventOtherDataType = "website" | "email" | "phone" | "price" | "other"

export type CalendarEventOtherDataItem = {
  type: CalendarEventOtherDataType
  value: string
  [key: string]: unknown
}

export type CalendarEventOtherData = CalendarEventOtherDataItem[]

type DbCalendarEvent = Tables<"calendar_events_view">

export const calendarEntityToModel = (dbEvent: DbCalendarEvent): CalendarEvent => {
  const id = dbEvent.short_id
  if (!id) {
    throw new Error("Event ID is required")
  }

  const otherData = dbEvent.other_data as {
    type: string
    value: Json | undefined
  }[]

  const otherDataFormatted: CalendarEventOtherData = otherData.map((data) => ({
    type: data.type as CalendarEventOtherDataType,
    value: (data.value as string) ?? "",
  }))

  const hasLocation =
    dbEvent.location_name != null && dbEvent.location_lat != null && dbEvent.location_lng != null

  return {
    id: id,
    title: dbEvent.title ?? "",
    description: dbEvent.description,
    content: dbEvent.content ?? "",
    coverImage: dbEvent.cover_image ?? "",
    startDate: new Date(dbEvent.start_date ?? 0),
    endDate: new Date(dbEvent.end_date ?? 0),
    location: hasLocation
      ? {
          name: dbEvent.location_name!,
          address: dbEvent.location_address,
          point: {
            lat: dbEvent.location_lat!,
            lng: dbEvent.location_lng!,
          },
        }
      : null,
    otherData: otherDataFormatted,
  }
}
