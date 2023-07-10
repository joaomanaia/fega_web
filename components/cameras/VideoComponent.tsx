import { CircularProgress } from "@mui/material"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"
import { CamerasPageType } from "../../pages/cameras_old"

interface VideoComponentProps extends CamerasPageType {}

const DynamicReactPlayer = dynamic(() => import("react-player"), {
  suspense: true,
})

const VideoComponent: React.FC<VideoComponentProps> = ({ selectedCamera }) => {
  const [videoPlaying, setVideoPlaying] = useState(false)

  const playVideo = () => setVideoPlaying(true)

  return (
    <div itemScope itemType="https://schema.org/VideoObject" className="h-full w-full">
      <meta itemProp="name" content={selectedCamera.name} />
      <meta itemProp="description" content={selectedCamera.description} />
      <meta itemProp="thumbnailUrl" content={selectedCamera.imagePoster} />
      <meta itemProp="uploadDate" content="07/05/2022" />
      <meta itemProp="contentUrl" content={selectedCamera.link} />

      <Suspense fallback={<CircularProgress />}>
        <DynamicReactPlayer
          volume={0}
          muted={true}
          playing={videoPlaying}
          onReady={playVideo}
          controls={true}
          width="100%"
          height="100%"
          url={selectedCamera.link}
        />
      </Suspense>
    </div>
  )
}

export default VideoComponent