"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import type { Tables } from "@/types/database.types"
import { useParams } from "next/navigation"

type CameraType = Tables<"cameras">

interface CameraItemProps {
  camera: CameraType
}

export const CameraItem: React.FC<CameraItemProps> = ({ camera }) => {
  const params = useParams()
  const selected = params.id === camera.id

  return (
    <Link
      itemProp="url"
      className={cn(
        "flex items-center h-fit px-4 py-4 next-link rounded-3xl hover:bg-surfaceVariant/[0.38] transition-colors",
        selected && "bg-primary hover:bg-primary/90 text-primary-foreground"
      )}
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

export const CameraItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center h-fit px-4 py-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="ml-4">
        <Skeleton className="w-32 h-4 mb-2" />
        <Skeleton className="w-64 h-4" />
      </div>
    </div>
  )
}
