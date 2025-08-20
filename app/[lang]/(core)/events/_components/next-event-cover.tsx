import { useMemo } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { DateLocationText } from "@/app/[lang]/(core)/events/_components/date-location-text"
import { Link } from "@/src/i18n/navigation"
import type { CalendarEvent } from "@/types/CalendarEvent"
import { createEventJsonLd } from "../utils/eventMetadataUtil"

interface NextEventCoverProps {
  event: CalendarEvent
}

export const NextEventCover: React.FC<NextEventCoverProps> = ({ event }) => {
  const t = useTranslations("EventsPage")
  const jsonLd = useMemo(() => createEventJsonLd(event), [event])

  return (
    <>
      <div className="mt-4 flex w-full flex-col items-start space-y-3 p-2 md:space-y-4 lg:mt-0 lg:w-3/2 lg:space-y-5 lg:p-4 xl:w-2/3 xl:space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <DateLocationText
          startDate={event.startDate}
          endDate={event.endDate}
          location={event.location}
        />
        <h1 className="w-full text-2xl font-bold lg:text-4xl xl:text-5xl">{event.title}</h1>
        {event.description && (
          <p className="text-surface-foreground/80 line-clamp-4 text-base xl:text-lg">
            {event.description}
          </p>
        )}

        <Button asChild>
          <Link className="w-full min-w-40 lg:w-auto" href={`/events/${event.id}`}>
            {t("seeMoreInfo")}
          </Link>
        </Button>
      </div>
      <div className="relative aspect-2/1 h-full w-full lg:aspect-3/2 xl:aspect-2/1">
        <Image
          src={event.coverImage}
          alt="Next Event Cover"
          layout="fill"
          className="rounded-3xl object-cover"
        />
      </div>
    </>
  )
}
