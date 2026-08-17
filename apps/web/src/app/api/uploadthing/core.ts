import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server"
import { getSession } from "@/lib/dal"

const f = createUploadthing()

const handleAuth = async () => {
  const session = await getSession()

  if (!session?.user) {
    throw new UploadThingError("Unauthorized")
  }

  return { user: session.user }
}

export const utapi = new UTApi()

const uploadthingAppBaseUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/`

export const deleteAvatarIfFromUploadthing = async (url: string): Promise<void> => {
  if (url.startsWith(uploadthingAppBaseUrl)) {
    const key = url.replace(uploadthingAppBaseUrl, "")
    await utapi.deleteFiles(key)
  }
}

export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = (metadata.user as { user_metadata?: { avatar_url?: string } })
        ?.user_metadata?.avatar_url

      if (oldAvatarUrl) {
        await deleteAvatarIfFromUploadthing(oldAvatarUrl)
      }

      const newAvatarUrl = `${uploadthingAppBaseUrl}${file.key}`

      return { avatarUrl: newAvatarUrl }
    }),
  newsImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  eventCoverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
