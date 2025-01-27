import { updateProfileAction } from "@/app/actions/userActions"
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks"
import type { UpdateProfileSchemaValues } from "@/lib/schemas/user-schemas"
import { useUploadThing } from "@/lib/uploadthing"
import { useMutation } from "@tanstack/react-query"

export function useUpdateProfileMutation(uid: string) {
  const { startUpload: startAvatarUpload } = useUploadThing("avatar")

  const editProfileMutation = useServerActionMutation(updateProfileAction)

  const uploadMutation = useMutation({
    mutationFn: async ({ values }: { values: UpdateProfileSchemaValues }) => {
      if (values.avatar !== null && values.avatar.startsWith("blob:")) {
        // Avatar is an blob url, so we need to convert it to a file first
        const blob = await fetch(values.avatar).then((res) => res.blob())
        const file = new File([blob], `avatar_${uid}.webp`)

        const uploadResult = await startAvatarUpload([file])
        const avatar = uploadResult?.[0]?.serverData?.avatarUrl ?? null

        return { ...values, avatar }
      }

      return values
    },
    onSuccess: async (values: UpdateProfileSchemaValues) => {
      await editProfileMutation.mutateAsync(values)
    },
  })

  return uploadMutation
}
