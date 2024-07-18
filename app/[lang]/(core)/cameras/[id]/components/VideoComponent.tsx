"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

interface VideoComponentProps {
  url: string
}

const DynamicReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
  loading: () => <p>Loading camera...</p>,
})

const VideoComponent: React.FC<VideoComponentProps> = ({ url }) => {
  const [videoPlaying, setVideoPlaying] = useState(false)

  const playVideo = () => setVideoPlaying(true)

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
        onReady={playVideo}
        controls={true}
        width="100%"
        height="100%"
        url={url}
      />
    </>
  )
}

export default VideoComponent
