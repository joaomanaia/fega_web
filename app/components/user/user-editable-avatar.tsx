"use client"

import { UserAvatar } from "@/app/components/user/user-avatar"
import { CropImageDialog } from "@/components/crop-image-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConfirm } from "@/hooks/use-confirm"
import { cn } from "@/lib/utils"
import { PencilIcon } from "lucide-react"
import { useState } from "react"

interface UserEditableAvatarProps {
  avatar: string | null
  currentAvatar: string | null
  name: string | null
  className?: string
  onAvatarChange?: (url: Blob | null) => void
  onRemoveAvatarRequest?: () => void
}

export const UserEditableAvatar: React.FC<UserEditableAvatarProps> = ({
  avatar,
  currentAvatar,
  name,
  className,
  onAvatarChange,
  onRemoveAvatarRequest,
}) => {
  const [cropImage, setCropImage] = useState<string | null>(null)

  const [ConfirmRemoveAvatarDialog, confirmRemoveAvatar] = useConfirm()

  // Remove the user's avatar from the database or
  // the current cropped image
  const handleRemoveAvatar = async () => {
    // If the avatar is not changed, remove it from the database
    if (avatar === currentAvatar) {
      const confirmed = await confirmRemoveAvatar()

      if (confirmed) {
        onRemoveAvatarRequest?.()
      }
    }

    // If the avatar is changed, remove the cropped image
    onAvatarChange?.(null)
  }

  return (
    <>
      <ConfirmRemoveAvatarDialog
        title="Remove avatar"
        message="Are you sure you want to remove your avatar?"
        confirmButtonContent="Remove"
      />

      <CropImageDialog
        shape="round"
        type="avatar"
        isOpen={!!cropImage}
        imageUrl={cropImage ?? ""}
        onClose={() => setCropImage(null)}
        onSave={(croppedImage) => {
          onAvatarChange?.(croppedImage)
        }}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Edit avatar"
            className={cn(
              "relative group flex items-center transition justify-center top-0 right-0 p-1 rounded-full size-24",
              className
            )}
          >
            <UserAvatar
              src={avatar}
              name={name}
              className="group-hover:opacity-50 size-full text-3xl transition"
            />
            <PencilIcon className="absolute size-7 opacity-0 group-hover:opacity-100 transition" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem asChild>
            <label htmlFor="avatar-upload" className="cursor-pointer">
              Edit avatar
            </label>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!avatar} onClick={handleRemoveAvatar} variant="error">
            Remove avatar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        id="avatar-upload"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setCropImage(URL.createObjectURL(file))
          }
        }}
        className="absolute hidden"
        type="file"
        accept="image/*"
      />

      <input readOnly id="cropped-image" type="file" accept="image/*" className="absolute hidden" />
    </>
  )
}
