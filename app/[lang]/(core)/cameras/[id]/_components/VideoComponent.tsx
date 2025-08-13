"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoComponentProps {
  url: string
}

const DynamicReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-video h-full w-full rounded-3xl" />,
})

const VideoComponent: React.FC<VideoComponentProps> = ({ url }) => {
  const [videoPlaying, setVideoPlaying] = useState(false)

  return (
    <>
      <DynamicReactPlayer
        style={{
          overflow: "hidden",
          borderRadius: "1rem",
        }}
        volume={0}
        muted={true}
        playing={videoPlaying}
        onCanPlay={() => {
          if (!videoPlaying) {
            setVideoPlaying(true)
          }
        }}
        controls={true}
        width="100%"
        height="100%"
        src={url}
      />
    </>
  )
}

export default VideoComponent
