import { Json, Tables } from "./database.types"
import { Location } from "./location"

export type CalendarEvent = {
  id: string
  title: string
  description: string
  content: string
  coverImage: string
  startDate: Date
  endDate: Date
  location: Location
  otherData: CalendarEventOtherData
}

export type CalendarEventOtherData = {
  website?: string
  email?: string
  phone?: string
  price?: number
}

type DbCalendarEvent = Tables<"calendar_events_view">

export const calendarEntityToModel = (dbEvent: DbCalendarEvent): CalendarEvent => {
  const id = dbEvent.short_id
  if (!id) {
    throw new Error("Event ID is required")
  }

  const otherData = dbEvent.other_data as { [key: string]: Json | undefined }

  return {
    id: id,
    title: dbEvent.title ?? "",
    description: dbEvent.description ?? "",
    content: dbEvent.content ?? "",
    coverImage: dbEvent.cover_image ?? "",
    startDate: new Date(dbEvent.start_date ?? 0),
    endDate: new Date(dbEvent.end_date ?? 0),
    location: {
      name: dbEvent.location_name ?? "",
      address: dbEvent.location_address ?? "",
      point: {
        lat: dbEvent.location_lat ?? 0,
        lng: dbEvent.location_lng ?? 0,
      }
    },
    otherData: {
      website: otherData.website as string | undefined,
      email: otherData.email as string | undefined,
      phone: otherData.phone as string | undefined,
      price: otherData.price as number | undefined,
    },
  }
}
