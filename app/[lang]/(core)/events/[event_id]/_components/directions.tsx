import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import { type CalendarEvent } from "@/types/CalendarEvent"
import { allDirectionApps, getDirectionUrl, type DirectionApp, type Point } from "@/types/location"

interface DirectionsProps {
  event: CalendarEvent
  className?: string
}

const DynamicMap = dynamic(() => import("../../_components/event-map"), {
  loading: () => <div>Loading map...</div>,
  ssr: !!false,
})

export const Directions: React.FC<DirectionsProps> = ({ event }) => {
  if (!event.location || !event.location.point) {
    return null
  }

  return (
    <div className="mt-4 flex w-full flex-col xl:w-3/4 2xl:w-1/2">
      <h2 className="text-lg font-bold">Directions</h2>
      <DirectionLinks point={event.location.point} className="mt-2" />
      <DynamicMap events={[event]} className="mt-3 aspect-video w-full" />
      <p className="mt-3 text-xl font-medium">{event.location.name}</p>
      <p className="text-surface-foreground/80 mt-1 text-base">{event.location.address}</p>
    </div>
  )
}

function DirectionLinks({ point, className }: { point: Point; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {allDirectionApps.map((app) => (
        <DirectionLink key={app} point={point} type={app} />
      ))}
    </div>
  )
}

interface DirectionLinkProps {
  point: Point
  type: DirectionApp
}

const DirectionLink: React.FC<DirectionLinkProps> = ({ point, type }) => {
  return (
    <Button variant="outline" size="sm" className="rounded-xl" asChild>
      <Link target="_blank" href={getDirectionUrl(point, type)}>
        {type === "google" ? "Google Maps" : type === "apple" ? "Apple Maps" : "Waze"}
      </Link>
    </Button>
  )
}
