"use client"

import { cn } from "@/lib/utils"
import { useMemo, useRef, useState } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

type Position = {
  lat: number
  lng: number
}

interface DraggableMarkerMapProps {
  className?: string
  center: Position
  onPositionChange: (position: Position) => void
}

const DraggableMarkerMap: React.FC<DraggableMarkerMapProps> = ({
  className,
  center,
  onPositionChange,
}) => {
  return (
    <MapContainer
      className={cn("w-full h-full rounded-xl", className)}
      center={center}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DraggableMarker onPositionChange={onPositionChange} center={center} />
    </MapContainer>
  )
}

export default DraggableMarkerMap

interface DraggableMarkerProps {
  onPositionChange: (position: Position) => void
  center: Position
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({ onPositionChange, center }) => {
  const [position, setPosition] = useState(center)
  const markerRef: React.RefObject<any> = useRef(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker?.getLatLng())
          onPositionChange(marker?.getLatLng())
        }
      },
    }),
    []
  )

  return (
    <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />
  )
}
