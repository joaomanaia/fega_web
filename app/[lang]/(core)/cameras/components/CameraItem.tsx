"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"
import type CameraType from "@/types/CameraType"
import Link from "next/link"
import { useParams } from "next/navigation"

interface CameraItemProps {
  camera: CameraType
  lang: Locale
}

export const CameraItem: React.FC<CameraItemProps> = ({ camera, lang }) => {
  const params = useParams()
  const selected = params.id === camera.id

  return (
    <Link
      itemProp="url"
      className={cn(
        "flex items-center h-fit px-4 py-4 next-link rounded-3xl hover:bg-surfaceVariant/[0.38] transition-colors",
        selected && "bg-primary hover:bg-primary/90 text-primary-foreground"
      )}
      lang={lang}
      href={`/cameras/${camera.id}`}
    >
      <Avatar>
        <AvatarImage itemProp="image" src={camera.image_poster} />
        <AvatarFallback>{camera.name}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h2 className="text-xl font-semibold" itemProp="name">
          {camera.name}
        </h2>
        <p className="text-sm text-inherit" itemProp="description">
          {camera.description}
        </p>
      </div>
    </Link>
  )
}
