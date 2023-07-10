import ImageVideoComponent from "@/app/(core)/cameras/[id]/components/ImageVideoComponent"
import VideoComponent from "@/app/(core)/cameras/[id]/components/VideoComponent"
import MainContainer from "@/components/m3/MainContainer"
import CameraType from "@/types/CameraType"
import { Metadata } from "next"

const getCameraById = async (id: string): Promise<CameraType | null> => {
  const api = await import("@/app/api/cameras/route")

  return api
    .GET()
    .then((res) => res.json() as Promise<CameraType[]>)
    .then((cameras) => cameras.find((camera) => camera.id === id) ?? null)
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

export default async function CameraPage({ params }: CameraPageProps) {
  const camera = await getCameraById(params.id)

  if (!camera) {
    return <MainContainer>Camera not found</MainContainer>
  }

  return (
    <MainContainer className="flex flex-col">
      <h1 className="text-xl font-normal mb-0">{camera.name}</h1>
      <p className="mb-8">{camera.description}</p>

      <div className="w-full h-full flex flex-col md:flex-row">
        {camera.video ? (
          <VideoComponent url={camera.link} />
        ) : (
          <ImageVideoComponent camera={camera} />
        )}
      </div>
    </MainContainer>
  )
}
