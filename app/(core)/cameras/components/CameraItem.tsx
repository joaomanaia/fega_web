"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import CameraType from "@/types/CameraType"
import Link from "next/link"
import { useParams } from "next/navigation"

interface CameraItemProps {
  camera: CameraType
}

export const CameraItem: React.FC<CameraItemProps> = ({ camera }) => {
  const params = useParams()
  const selected = params.id === camera.id

  return (
    <Link
      className={cn(
        "flex items-center h-fit px-4 next-link rounded-3xl hover:bg-accent/[0.38] transition-colors",
        selected && "bg-primary hover:bg-primary/90 text-primary-foreground"
      )}
      href={`/cameras/${camera.id}`}
    >
      <Avatar>
        <AvatarImage src={camera.image_poster} />
        <AvatarFallback>{camera.name}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h2 className="text-xl font-semibold mb-0">{camera.name}</h2>
        <p className="text-sm text-inherit mt-1">{camera.description}</p>
      </div>
    </Link>
  )
}
