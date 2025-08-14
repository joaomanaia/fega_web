import { Link } from "@/src/i18n/navigation"
import { type CalendarEvent } from "@/types/CalendarEvent"
import { type DirectionApp, type Point, getDirectionUrl } from "@/types/location"
import dynamic from "next/dynamic"

interface DirectionsProps {
  event: CalendarEvent
  className?: string
}

const DynamicMap = dynamic(() => import("../../components/event-map"), {
  loading: () => <div>Loading map...</div>,
  ssr: !!false,
})

export const Directions: React.FC<DirectionsProps> = ({ event }) => {
  return (
    <div className="flex flex-col w-full xl:w-3/4 2xl:w-1/2 mt-4">
      <h2 className="text-lg font-bold">Directions</h2>
      <div className="flex items-center gap-2 mt-2">
        <DirectionLink point={event.location.point} type="google" />
        <DirectionLink point={event.location.point} type="apple" />
        <DirectionLink point={event.location.point} type="waze" />
      </div>
      <DynamicMap events={[event]} className="w-full aspect-video mt-3" />
      <p className="text-xl font-medium mt-3">{event.location.name}</p>
      <p className="text-base text-surface-foreground/80 mt-1">{event.location.address}</p>
    </div>
  )
}

interface DirectionLinkProps {
  point: Point
  type: DirectionApp
}

const DirectionLink: React.FC<DirectionLinkProps> = ({ point, type }) => {
  return (
    <Link
      className="text-sm text-center w-fit bg-surface-variant/50 hover:bg-surface-variant/70 text-surface-variant-foreground px-4 py-2 rounded-xl cursor-pointer"
      href={getDirectionUrl(point, type)}
    >
      {type === "google" ? "Google Maps" : type === "apple" ? "Apple Maps" : "Waze"}
    </Link>
  )
}
