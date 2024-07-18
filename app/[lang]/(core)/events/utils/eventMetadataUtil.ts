import type { CalendarEvent } from "@/types/CalendarEvent"
import type { Event, WithContext } from "schema-dts"

export const createEventJsonLd = (event: CalendarEvent): WithContext<Event> => {
  const pricing = event.otherData?.find((data) => data.type === "price")?.value
  const isAccessibleForFree = pricing
    ? pricing === "Free" || pricing === "Grátis" || pricing === "0"
    : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.coverImage,
    isAccessibleForFree: isAccessibleForFree,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    location: {
      "@type": "Place",
      name: event.location.name,
      address: event.location.address,
      geo: {
        "@type": "GeoCoordinates",
        latitude: event.location.point.lat,
        longitude: event.location.point.lng,
      },
    },
  }
}
