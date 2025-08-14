"use client"

import { useQuery } from "@tanstack/react-query"
import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { Tables } from "@/types/database.types"

type CameraType = Tables<"cameras">

interface ImageVideoComponentProps {
  camera: CameraType
}

const ImageVideoComponent: React.FC<ImageVideoComponentProps> = ({ camera }) => {
  const { data, error, isPending } = useQuery({
    queryKey: ["camera", camera.id],
    queryFn: async ({ signal }) => {
      const response = await fetch(camera.link, {
        method: "GET",
        cache: "no-cache",
        signal,
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch camera image: ${response.statusText}`)
      }
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    },
    refetchInterval: camera.video ? false : 1000 * 2, // 2 seconds
    refetchOnWindowFocus: false,
    enabled: Boolean(!camera.video && camera.link),
  })

  if (isPending) {
    return <Skeleton className="aspect-video h-full w-full rounded-3xl" />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="size-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  /* eslint-disable @next/next/no-img-element */
  return <img src={data} alt={camera.name} className="h-full w-full rounded-3xl object-cover" />
}

export default ImageVideoComponent
