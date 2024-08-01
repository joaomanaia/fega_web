import { type Metadata } from "next"
import { MainContainer } from "@/app/components/m3/main-container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerComponentClient } from "@/supabase"
import VideoComponent from "./components/VideoComponent"
import ImageVideoComponent from "./components/ImageVideoComponent"
import { type Tables } from "@/types/database.types"
import { notFound } from "next/navigation"

type CameraType = Tables<"cameras">

const getCameraById = async (id: string): Promise<CameraType | null> => {
  const supabase = createServerComponentClient()

  const { data } = await supabase.from("cameras").select("*").eq("id", id).single()

  return data as CameraType | null
}

type CameraPageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: CameraPageProps): Promise<Metadata> {
  const camera = await getCameraById(params.id)

  if (!camera) return { title: "Camera not found" }

  return {
    title: camera.name,
    description: camera.description,
  }
}

export const dynamic = "force-dynamic"

export default async function CameraPage({ params }: CameraPageProps) {
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
        <Link href={camera.original_camera_url}>
          <Button variant="outline" className="w-fit mb-4">
            Ver original
          </Button>
        </Link>
      )}

      {camera.video ? (
        <VideoComponent url={camera.link} />
      ) : (
        <ImageVideoComponent camera={camera} />
      )}
    </MainContainer>
  )
}
