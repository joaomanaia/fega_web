import { updateProfileAction } from "@/app/actions/userActions"
import type { UpdateProfileSchemaValues } from "@/lib/schemas/user-schemas"
import { useUploadThing } from "@/lib/uploadthing"
import { useMutation } from "@tanstack/react-query"

export function useUpdateProfileMutation(uid: string) {
  const { startUpload: startAvatarUpload } = useUploadThing("avatar")

  const uploadMutation = useMutation({
    mutationFn: async ({ values }: { values: UpdateProfileSchemaValues }) => {
      let finalValues = values

      if (values.avatar !== null && values.avatar.startsWith("blob:")) {
        // Avatar is a blob url, so we need to convert it to a file first
        const blob = await fetch(values.avatar).then((res) => res.blob())
        const file = new File([blob], `avatar_${uid}.webp`)

        const uploadResult = await startAvatarUpload([file])
        const avatar = uploadResult?.[0]?.serverData?.avatarUrl ?? null

        finalValues = { ...values, avatar }
      }

      const result = await updateProfileAction(finalValues)
      if (result?.validationErrors?.username?._errors?.[0]) {
        throw new Error(result.validationErrors.username._errors[0])
      }
      if (result?.serverError) {
        throw new Error(result.serverError.message)
      }

      return result?.data
    },
  })

  return uploadMutation
}
