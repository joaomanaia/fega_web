import { useMemo } from "react"
import Image from "next/image"
import { DateLocationText } from "@/app/[lang]/(core)/events/_components/date-location-text"
import { Link } from "@/src/i18n/navigation"
import { type CalendarEvent } from "@/types/CalendarEvent"
import { createEventJsonLd } from "../utils/eventMetadataUtil"

interface EventComponentProps {
  event: CalendarEvent
}

export const EventComponent: React.FC<EventComponentProps> = ({ event }) => {
  const jsonLd = useMemo(() => createEventJsonLd(event), [event])

  return (
    <Link
      href={`/events/${event.id}`}
      className="bg-surface-variant/30 hover:bg-surface-variant/40 group flex cursor-pointer flex-col rounded-2xl p-0 transition hover:scale-101"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative aspect-video w-full">
        <Image
          src={event.coverImage}
          fill
          className="rounded-2xl object-cover"
          alt="Event cover image" // TODO: Add alt text
        />
      </div>
      <DateLocationText
        startDate={event.startDate}
        endDate={event.endDate}
        location={event.location}
        className="mx-4 mt-3"
      />
      <h3 className="mx-4 mt-2 w-full text-xl font-semibold lg:text-2xl">{event.title}</h3>
      <p className="text-surface-foreground/80 mx-4 mb-3 line-clamp-2 text-sm lg:text-base xl:text-lg">
        {event.description}
      </p>
    </Link>
  )
}
