"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

interface VideoComponentProps {
  url: string
  className?: string
}

const DynamicReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
  loading: () => <p>Loading camera...</p>,
})

const VideoComponent: React.FC<VideoComponentProps> = ({ url, className }) => {
  const [videoPlaying, setVideoPlaying] = useState(false)

  const playVideo = () => setVideoPlaying(true)

  return (
    <div className={twMerge("h-full w-full", className)}>
      <DynamicReactPlayer
        volume={0}
        muted={true}
        playing={videoPlaying}
        onReady={playVideo}
        controls={true}
        width="100%"
        height="100%"
        url={url}
      />
    </div>
  )
}

export default VideoComponent
