import MainContainer from "@/app/(core)/components/m3/MainContainer"
import CameraType from "@/types/CameraType"
import { Metadata } from "next"
import CameraItem from "./components/CameraItem"

export const metadata: Metadata = {
  title: "Cameras",
}

const getAllCameras = async (): Promise<CameraType[]> => {
  /*
  const response = await fetchServer("/api/cameras")

  return response.json()
  */

  const api = await import("@/app/api/cameras/route")
  const res = await api.GET()
  
  return res.json()
}

export const dynamic = "force-dynamic"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cameras = await getAllCameras()

  return (
    <div className="flex flex-col">
      {children}
      <MainContainer>
        <div className="flex flex-col xl:grid xl:grid-cols-2 2xl:grid-cols-3 w-full h-full">
          {cameras.map((camera) => (
            <CameraItem key={camera.id} camera={camera} />
          ))}
        </div>
      </MainContainer>
    </div>
  )
}
