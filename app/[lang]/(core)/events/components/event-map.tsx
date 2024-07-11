"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "./event-map.styles.css"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { type CalendarEvent } from "@/types/CalendarEvent"
import { Link } from "@/components/link"
import Image from "next/image"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { DateText } from "./date-text"

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
    if (events.length === 1) return events[0].location.point

    // Calculate the average of all the locations
    // TODO: Implement this
    return events[0].location.point
  }, [events])

  return (
    <MapContainer
      className={cn("w-full h-full rounded-xl z-0", className)}
      center={center}
      zoom={13}
    >
      <TileLayer
        className="map-tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker position={[event.location.point.lat, event.location.point.lng]}>
          <Popup minWidth={300}>
            <div className="flex flex-col gap-2 w-full">
              <div className="relative w-full h-36">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  className="rounded-2xl object-cover"
                  fill
                />
              </div>
              <Link className="text-base font-semibold" href={`/events/${event.id}`}>
                {event.title}
              </Link>
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-5" />
                <DateText
                  startDate={event.startDate}
                  endDate={event.endDate}
                  className="truncate"
                />
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-5" />
                <span className="truncate">{event.location.name}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
