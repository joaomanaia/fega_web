import { Button } from "@/components/ui/button"
import Image from "next/image"
import { DateText } from "./date-text"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import type { CalendarEvent } from "@/types/CalendarEvent"
import { useMemo } from "react"
import { createEventJsonLd } from "../utils/eventMetadataUtil"
import { Link } from "@/src/i18n/navigation"
import { useTranslations } from "next-intl"

interface NextEventCoverProps {
  event: CalendarEvent
}

export const NextEventCover: React.FC<NextEventCoverProps> = ({ event }) => {
  const t = useTranslations("EventsPage")
  const jsonLd = useMemo(() => createEventJsonLd(event), [event])

  return (
    <>
      <div className="flex flex-col items-start space-y-3 md:space-y-4 lg:space-y-5 w-full lg:w-3/2 xl:w-2/3 p-2 lg:p-4 mt-4 lg:mt-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="flex items-center space-x-2">
          <CalendarIcon className="size-5" />
          <DateText startDate={event.startDate} endDate={event.endDate} />
          <span>&bull;</span>
          <MapPinIcon className="size-5" />
          <span>{event.location.name}</span>
        </div>
        <h1 className="text-2xl lg:text-4xl xl:text-5xl w-full font-bold">{event.title}</h1>
        <p className="text-base xl:text-lg text-surface-foreground/80 line-clamp-4">
          {event.description}
        </p>

        <Button asChild>
          <Link href={`/events/${event.id}`}>{t("seeMoreInfo")}</Link>
        </Button>
      </div>
      <div className="relative h-full w-full aspect-[2/1] lg:aspect-[3/2] xl:aspect-[2/1]">
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
