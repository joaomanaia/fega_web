import type CameraType from "@/types/CameraType"
import { type Metadata } from "next"
import { CameraItem } from "./components/CameraItem"
import { MainContainer } from "@/app/components/m3/main-container"
import { createServerComponentClient } from "@/supabase"
import { formatUrlWithBasePath } from "@/core/util/baseUrlUtils"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"

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

interface CameraLayoutProps {
  params: {
    lang: Locale
  }
  children: React.ReactNode
}

export default async function Layout({ params, children }: CameraLayoutProps) {
  const cameras = await getAllCameras()

  return (
    <main className="flex flex-col h-full md:pb-3 overflow-y-auto">
      {children}
      <MainContainer className="rounded-b-none md:rounded-[30px] last:mt-4">
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
              <CameraItem camera={camera} lang={params.lang} />
            </li>
          ))}
        </ul>
      </MainContainer>
    </main>
  )
}
