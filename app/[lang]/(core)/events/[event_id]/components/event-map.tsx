"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Location } from "@/types/location"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { cn } from "@/lib/utils"
import { LatLngExpression } from "leaflet"

interface EventMapProps {
  location: Location
  className?: string
}

export default function EventMap({ location, className }: EventMapProps) {
  const position: LatLngExpression = [location.point.lat, location.point.lng]

  return (
    <MapContainer
      className={cn("w-full h-full rounded-xl", className)}
      center={position}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>{location.name}</Popup>
      </Marker>
    </MapContainer>
  )
}
