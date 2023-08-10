"use client"

/* eslint-disable @next/next/no-img-element */
import CameraType from "@/types/CameraType"
import { useEffect, useState } from "react"

interface ImageVideoComponentProps {
  camera: CameraType
}

const ImageVideoComponent: React.FC<ImageVideoComponentProps> = ({ camera }) => {
  const [cameraImage, setCameraImage] = useState<string>()

  useEffect(() => {
    if (!camera.video) {
      const intervalId = setInterval(() => {
        fetch(camera.link, {
          method: "GET",
          cache: "no-cache",
        })
          .then((res) => res.blob())
          .then((data) => URL.createObjectURL(data))
          .then((data) => setCameraImage(data))
      }, 2500)

      return () => clearInterval(intervalId)
    }

    return () => {}
  }, [camera.video, camera.link])

  return (
    <div className="h-full w-full">
      <img src={cameraImage} alt={camera.name} className="w-full h-full rounded-3xl" />
    </div>
  )
}

export default ImageVideoComponent
