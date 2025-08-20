import type { Event, WithContext } from "schema-dts"
import type { CalendarEvent } from "@/types/CalendarEvent"

export const createEventJsonLd = (event: CalendarEvent): WithContext<Event> => {
  const pricing = event.otherData?.find((data) => data.type === "price")?.value
  const isAccessibleForFree = pricing
    ? pricing === "Free" || pricing === "Grátis" || pricing === "0"
    : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    image: event.coverImage,
    isAccessibleForFree: isAccessibleForFree,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    location: event.location
      ? {
          "@type": "Place",
          name: event.location.name,
          address: event.location.address ?? undefined,
          geo: {
            "@type": "GeoCoordinates",
            latitude: event.location.point.lat,
            longitude: event.location.point.lng,
          },
        }
      : undefined,
  }
}
