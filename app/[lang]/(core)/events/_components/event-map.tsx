"use client"

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "./event-map.styles.css"
import { useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DateLocationText } from "@/app/[lang]/(core)/events/_components/date-location-text"
import Link from "@/components/link"
import { cn } from "@/lib/utils"
import { type CalendarEvent } from "@/types/CalendarEvent"

interface EventMapProps {
  events: CalendarEvent[]
  className?: string
}

export default function EventMap({ events, className }: EventMapProps) {
  // Calculate the center of the map based on the locations
  const center = useMemo(() => {
    // If there are no locations, return the default center
    if (events.length === 0) return { lat: 0, lng: 0 }
    // If there is only one location, return that location's point
    if (events.length === 1) return events[0].location?.point

    // Calculate the average of all the locations
    // TODO: Implement this
    return events[0].location?.point
  }, [events])

  // Filter events to only those with a location point
  const eventsFilter = useMemo(() => {
    return events.filter((event) => event.location?.point)
  }, [events])

  return (
    <MapContainer
      className={cn("z-0 h-full w-full rounded-xl", className)}
      center={center}
      zoom={13}
    >
      <TileLayer
        className="map-tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {eventsFilter.map((event) => {
        if (!event.location?.point) {
          return null
        }

        return (
          <Marker key={event.id} position={[event.location.point.lat, event.location.point.lng]}>
            <Popup minWidth={300}>
              <div className="flex w-full flex-col gap-2">
                <Link href={`/events/${event.id}`} className="relative h-36 w-full">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    className="rounded-2xl object-cover"
                    fill
                  />
                </Link>
                <Link className="text-base font-semibold" href={`/events/${event.id}`}>
                  {event.title}
                </Link>
                <DateLocationText
                  startDate={event.startDate}
                  endDate={event.endDate}
                  location={event.location}
                />
                <Button className="mt-2 w-full" asChild>
                  <Link className="!text-primary-foreground" href={`/events/${event.id}`}>
                    More Info
                  </Link>
                </Button>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
