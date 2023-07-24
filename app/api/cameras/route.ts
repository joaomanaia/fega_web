import CameraType from "@/types/CameraType"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { formatUrlWithBasePath } from "@/core/util/baseUrlUtils"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

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
