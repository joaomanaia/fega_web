import ImageVideoComponent from "@/app/(core)/cameras/[id]/components/ImageVideoComponent"
import VideoComponent from "@/app/(core)/cameras/[id]/components/VideoComponent"
import CameraType from "@/types/CameraType"
import { Metadata } from "next"
import { MainContainer } from "../../components/m3/main-container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerComponentClient } from "@/supabase"

const getCameraById = async (id: string): Promise<CameraType | null> => {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("cameras").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return data as CameraType | null
}

type CameraPageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: CameraPageProps): Promise<Metadata> {
  const id = params.id

  const camera = await getCameraById(id)

  return {
    title: camera?.name ?? "Camera not found",
    description: camera?.description ?? "",
  }
}

export const dynamic = "force-dynamic"

export default async function CameraPage({ params }: CameraPageProps) {
  const camera = await getCameraById(params.id)

  if (!camera) {
    return <MainContainer>Camera not found</MainContainer>
  }

  return (
    <MainContainer className="flex flex-col">
      <h1 className="text-xl font-normal mb-2">{camera.name}</h1>
      <p className="mb-4">{camera.description}</p>

      {camera.original_camera && (
        <Link href={camera.original_camera}>
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
