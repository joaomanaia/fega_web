import CameraType from "@/types/CameraType"
import { Metadata } from "next"
import { CameraItem } from "./components/CameraItem"
import { MainContainer } from "../components/m3/main-container"
import { createServerComponentClient } from "@/supabase"
import { formatUrlWithBasePath } from "@/core/util/baseUrlUtils"

export const metadata: Metadata = {
  title: "Cameras",
}

const getAllCameras = async (): Promise<CameraType[]> => {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("cameras").select("*")

  if (error) {
    return []
  }

  const cameras = (data as CameraType[]) || []

  const camerasFormatted: CameraType[] = cameras.map((camera) => {
    if (camera.link.startsWith("/api/")) {
      camera.link = formatUrlWithBasePath(camera.link)
    }

    return camera
  })

  return camerasFormatted
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
