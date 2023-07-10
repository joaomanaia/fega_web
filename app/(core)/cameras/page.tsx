import CameraType from "@/types/CameraType"
import CameraItem from "./components/CameraItem"

const getAllCameras = async () => {
  /*
  const response = await fetch("/api/cameras")
  const cameras = await response.json()
  */

  const res = await import("@/app/api/cameras/route")
  const cameras = await (await res.GET()).json()

  return cameras as CameraType[]
}

export default async function CamerasPage() {
  const cameras = await getAllCameras()

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-2 2xl:grid-cols-3 w-full h-full">
      {cameras.map((camera) => (
        <CameraItem key={camera.id} camera={camera} />
      ))}
    </div>
  )
}
