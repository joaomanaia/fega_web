import { cn } from "@/lib/utils"
import { DirectionApp, Location, Point, getDirectionUrl } from "@/types/location"
import dynamic from "next/dynamic"
import Link from "next/link"

interface DirectionsProps {
  location: Location
  className?: string
}

const DynamicMap = dynamic(() => import("./event-map"), {
  loading: () => <div>Loading map...</div>,
  ssr: false,
})

export const Directions: React.FC<DirectionsProps> = ({ location }) => {
  return (
    <div className="flex flex-col w-full xl:w-3/4 2xl:w-1/2 mt-4">
      <h2 className="text-lg font-bold">Directions</h2>
      <div className="flex items-center gap-2 mt-2">
        <DirectionLink point={location.point} type="google" />
        <DirectionLink point={location.point} type="apple" />
        <DirectionLink point={location.point} type="waze" />
      </div>
      <DynamicMap location={location} className="w-full aspect-video mt-3" />
      <p className="text-xl font-medium mt-3">{location.name}</p>
      <p className="text-base text-surface-foreground/80 mt-1">{location.address}</p>
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
      className="text-sm text-center w-fit bg-surfaceVariant/50 hover:bg-surfaceVariant/70 text-surfaceVariant-foreground px-4 py-2 rounded-xl cursor-pointer"
      href={getDirectionUrl(point, type)}
    >
      {type === "google" ? "Google Maps" : type === "apple" ? "Apple Maps" : "Waze"}
    </Link>
  )
}
