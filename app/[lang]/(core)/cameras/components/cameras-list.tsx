import { formatUrlWithBasePath } from "@/core/util/baseUrlUtils"
import { type Tables } from "@/types/database.types"
import { CameraItem, CameraItemSkeleton } from "./CameraItem"
import { createClient } from "@/lib/supabase/server"

type CameraType = Tables<"cameras">

const getAllCameras = async (): Promise<CameraType[]> => {
  const supabase = await createClient()

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

export const CamerasList: React.FC = async () => {
  const cameras = await getAllCameras()

  return (
    <ul
      itemScope
      itemType="https://schema.org/ItemList"
      className="flex flex-col h-full md:h-fit xl:grid xl:grid-cols-2 2xl:grid-cols-3 w-full"
    >
      <meta itemProp="numberOfItems" content={String(cameras.length)} />
      {cameras.map((camera, index) => (
        <li
          key={camera.id}
          itemScope
          itemProp="itemListElement"
          itemType="https://schema.org/ListItem"
        >
          <meta itemProp="position" content={String(index + 1)} />
          <CameraItem camera={camera} />
        </li>
      ))}
    </ul>
  )
}

export const CamerasListSkeleton: React.FC = () => {
  return (
    <ul className="flex flex-col h-full md:h-fit xl:grid xl:grid-cols-2 2xl:grid-cols-3 w-full">
      {[...Array(6)].map((_, index) => (
        <li key={index}>
          <CameraItemSkeleton />
        </li>
      ))}
    </ul>
  )
}
