import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { getCameraById } from "@/app/[lang]/(core)/cameras/_lib/queries"
import { MainContainer } from "@/app/components/m3/main-container"
import { createClient } from "@/lib/supabase/client"
import { Link } from "@/src/i18n/navigation"

type CameraPageProps = {
  params: Promise<{ lang: Locale; id: string }>
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

const VideoComponent = dynamic(() => import("./_components/VideoComponent"))
const ImageVideoComponent = dynamic(() => import("./_components/ImageVideoComponent"))

export default async function CameraPage(props: CameraPageProps) {
  const params = await props.params
  setRequestLocale(params.lang)

  const camera = await getCameraById(params.id)

  if (!camera) {
    notFound()
  }

  return (
    <MainContainer className="flex flex-col">
      <h1 className="mb-2 text-xl font-normal" itemProp="name">
        {camera.name}
      </h1>
      <p className="mb-4" itemProp="description">
        {camera.description}
      </p>

      {camera.original_camera_url && (
        <Button variant="outline" className="mb-4 w-fit" asChild>
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

export async function generateStaticParams() {
  // Need to be client side because of generateStaticParams
  const supabase = createClient()

  const { data, error } = await supabase.from("cameras").select("id")

  if (error || !data) {
    return []
  }

  return data.map((camera) => ({ id: camera.id }))
}
