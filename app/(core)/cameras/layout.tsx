import CameraType from "@/types/CameraType"
import { Metadata } from "next"
import { CameraItem } from "./components/CameraItem"
import { MainContainer } from "../components/m3/main-container"

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
    <main className="flex flex-col h-full md:pb-3 overflow-y-auto">
      {children}
      <MainContainer className="flex flex-col h-full md:h-fit rounded-b-none last:mt-4 md:rounded-[30px] xl:grid xl:grid-cols-2 2xl:grid-cols-3 w-full">
        {cameras.map((camera) => (
          <CameraItem key={camera.id} camera={camera} />
        ))}
      </MainContainer>
    </main>
  )
}
