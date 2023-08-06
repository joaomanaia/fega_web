import CameraType from "@/types/CameraType"
import { NextResponse } from "next/server"
import { formatUrlWithBasePath } from "@/core/util/baseUrlUtils"
import { createRouteHandlerClient } from "@/supabase"

export async function GET() {
  const supabase = createRouteHandlerClient()

  const { data, error } = await supabase.from("cameras").select("*")

  if (error) {
    console.log(error)
    return NextResponse.error()
  }

  const cameras = (data as CameraType[]) || []

  const camerasFormatted: CameraType[] = cameras.map((camera) => {
    if (camera.link.startsWith("/api/")) {
      camera.link = formatUrlWithBasePath(camera.link)
    }

    return camera
  })

  return NextResponse.json(camerasFormatted)
}
