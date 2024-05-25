import { createRouteHandlerClient } from "@/supabase"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

const hadleAuth = async () => {
  const supabase = createRouteHandlerClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user || !user.user) {
    throw new UploadThingError("Unauthorized")
  }

  return { userId: user.user.id }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  newsImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => hadleAuth())
    .onUploadComplete(() => {}),
  eventCoverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => hadleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
