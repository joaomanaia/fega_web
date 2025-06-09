import { type Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { Button } from "@/components/ui/button"
import VideoComponent from "./components/VideoComponent"
import ImageVideoComponent from "./components/ImageVideoComponent"
import { type Tables } from "@/types/database.types"
import { notFound } from "next/navigation"
import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { Link } from "@/src/i18n/navigation"

type CameraType = Tables<"cameras">

const getCameraById = cache(async (id: string): Promise<CameraType | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase.from("cameras").select("*").eq("id", id).single()

  if (error) return null
  return data
})

type CameraPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: CameraPageProps): Promise<Metadata> {
  const params = await props.params
  const camera = await getCameraById(params.id)

  if (!camera) notFound()

  return {
    title: camera.name,
    description: camera.description,
    openGraph: {
      title: camera.name,
      description: camera.description,
      images: camera.image_poster,
      url: `/cameras/${camera.id}`,
    },
  }
}

export default async function CameraPage(props: CameraPageProps) {
  const params = await props.params
  const camera = await getCameraById(params.id)

  if (!camera) {
    notFound()
  }

  return (
    <MainContainer className="flex flex-col">
      <h1 className="text-xl font-normal mb-2" itemProp="name">
        {camera.name}
      </h1>
      <p className="mb-4" itemProp="description">
        {camera.description}
      </p>

      {camera.original_camera_url && (
        <Button variant="outline" className="w-fit mb-4" asChild>
          <Link href={camera.original_camera_url}>Ver original</Link>
        </Button>
      )}

      {camera.video ? (
        <VideoComponent url={camera.link} />
      ) : (
        <ImageVideoComponent camera={camera} />
      )}
    </MainContainer>
  )
}
