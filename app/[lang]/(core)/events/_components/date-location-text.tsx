import { CalendarIcon, MapPinIcon } from "lucide-react"
import { useFormatter } from "next-intl"
import { cn } from "@/lib/utils"
import type { Location } from "@/types/location"

export function DateLocationText({
  startDate,
  endDate,
  location,
  className,
}: {
  startDate: Date
  endDate: Date
  location: Location | null
  className?: string
}) {
  const format = useFormatter()

  return (
    <div
      className={cn(
        "text-surface-foreground/80 flex flex-wrap items-center gap-1.5 text-sm",
        className
      )}
    >
      <span className="flex items-center gap-x-1.5">
        <CalendarIcon className="size-4" />
        {format.dateTimeRange(startDate, endDate, "short")}
      </span>
      {location && (
        <>
          <span>&bull;</span>
          <span className="flex items-center gap-x-1.5">
            <MapPinIcon className="size-4" />
            {location.name}
          </span>
        </>
      )}
    </div>
  )
}
