import { getAllCameras } from "@/app/[lang]/(core)/cameras/_lib/queries"
import { CameraItem, CameraItemSkeleton } from "./CameraItem"

export const CamerasList: React.FC = async () => {
  const cameras = await getAllCameras()

  return (
    <ul
      itemScope
      itemType="https://schema.org/ItemList"
      className="flex h-full w-full flex-col md:h-fit xl:grid xl:grid-cols-2 2xl:grid-cols-3"
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
    <ul className="flex h-full w-full flex-col md:h-fit xl:grid xl:grid-cols-2 2xl:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <li key={index}>
          <CameraItemSkeleton />
        </li>
      ))}
    </ul>
  )
}
