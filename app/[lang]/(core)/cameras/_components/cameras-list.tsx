import { cacheLife } from "next/cache"
import { CameraIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getAllCameras } from "@/app/[lang]/(core)/cameras/_lib/queries"
import { CameraItem, CameraItemSkeleton } from "./CameraItem"

export const CamerasList: React.FC = async () => {
  "use cache"
  cacheLife("weeks")

  const cameras = await getAllCameras()

  if (cameras.length === 0) {
    const t = await getTranslations("CamerasPage.emptyCamerasPage")

    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CameraIcon />
          </EmptyMedia>
          <EmptyTitle>{t("header")}</EmptyTitle>
          <EmptyDescription>{t("description")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

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
