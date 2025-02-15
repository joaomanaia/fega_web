import { createClient } from "@/lib/supabase/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server"

const f = createUploadthing()

const hadleAuth = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user || !user.user) {
    throw new UploadThingError("Unauthorized")
  }

  return { user: user.user }
}

export const utapi = new UTApi()

const uploadthingAppBaseUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/`

export const deleteAvatarIfFromUploadthing = async (url: string) => {
  // Check if the user has an avatar old uploaded in uploadthing
  if (url.startsWith(uploadthingAppBaseUrl)) {
    const key = url.replace(uploadthingAppBaseUrl, "")

    await utapi.deleteFiles(key)
  }
}

// If need update the file size, update to in the constants.ts
export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } })
    .middleware(() => hadleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.user_metadata.avatar_url

      if (oldAvatarUrl) {
        await deleteAvatarIfFromUploadthing(oldAvatarUrl)
      }

      const newAvatarUrl = `${uploadthingAppBaseUrl}${file.key}`

      return { avatarUrl: newAvatarUrl }
    }),
  newsImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => hadleAuth())
    .onUploadComplete(() => {}),
  eventCoverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => hadleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
