import { CalendarEvent } from "@/types/CalendarEvent"
import { DateText } from "./date-text"
import Image from "next/image"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"

interface EventComponentProps {
  event: CalendarEvent
}

export const EventComponent: React.FC<EventComponentProps> = ({ event }) => {
  return (
    <Link
      href={`/events/${event.id}`}
      className="bg-surfaceVariant/30 hover:bg-surfaceVariant/50 p-0 rounded-2xl hover:rounded-3xl flex flex-col group cursor-pointer transition"
    >
      <div className="relative w-full aspect-video">
        <Image
          src={event.coverImage}
          fill
          className="rounded-2xl group-hover:rounded-3xl object-cover transition"
          alt="Event cover image" // TODO: Add alt text
        />
      </div>
      <div className="flex items-center space-x-2 mx-4 mt-4">
        <CalendarIcon className="size-5" />
        <DateText startDate={event.startDate} endDate={event.endDate} className="truncate" />
        <span>&bull;</span>
        <MapPinIcon className="size-5" />
        <span className="truncate">{event.location.name}</span>
      </div>
      <h3 className="text-xl lg:text-2xl w-full font-semibold mt-3 mb-2 mx-4">{event.title}</h3>
      <p className="text-sm lg:text-base xl:text-lg mb-3 mx-4 text-surface-foreground/80 line-clamp-2">
        {event.description}
      </p>
    </Link>
  )
}
