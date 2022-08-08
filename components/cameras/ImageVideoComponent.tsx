/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { CamerasPageType, getCameraById } from "../../pages/cameras"

interface ImageVideoComponentProps extends CamerasPageType {}

const ImageVideoComponent: React.FC<ImageVideoComponentProps> = ({ selectedCamera }) => {
  const [cameraImageUrl, setCameraImageUrl] = useState<string>(
    getCameraById("hoteloslo-coimbra")?.link || ""
  )

  useEffect(() => {
    if (selectedCamera.id == "hoteloslo-coimbra") {
      const cameraUrl = getCameraById("hoteloslo-coimbra")?.link

      if (cameraUrl === undefined) return () => {}

      const intervalId = setInterval(() => {
        const url = cameraUrl + "?date=" + new Date().getTime()
        setCameraImageUrl(url)
      }, 500)

      return () => clearInterval(intervalId)
    }

    return () => {}
  }, [selectedCamera.id])

  return (
    <div itemScope itemType="https://schema.org/VideoObject" className="h-full w-full pb-32 pt-8">
      <meta itemProp="name" content={selectedCamera.name} />
      <meta itemProp="description" content={selectedCamera.description} />
      <meta itemProp="thumbnailUrl" content={selectedCamera.imagePoster} />
      <meta itemProp="uploadDate" content="07/05/2022" />
      <meta itemProp="contentUrl" content={selectedCamera.link} />

      <img src={cameraImageUrl} alt={selectedCamera.name} className="w-full h-full" />
    </div>
  )
}

export default ImageVideoComponent