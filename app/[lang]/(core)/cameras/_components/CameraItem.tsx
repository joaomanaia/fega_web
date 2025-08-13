"use client"

import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import type { Tables } from "@/types/database.types"

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
        "next-link flex h-fit items-center rounded-3xl px-4 py-4 transition-colors hover:bg-surfaceVariant/[0.38]",
        selected && "bg-primary text-primary-foreground hover:bg-primary/90"
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
    <div className="flex h-fit items-center px-4 py-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="ml-4">
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  )
}
