"use client"

import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useTranslations } from "next-intl"
import { UserAvatar } from "@/app/components/user/user-avatar"
import Linkify from "@/components/linkify"
import { useModal } from "@/hooks/use-modal-store"
import type UserType from "@/types/UserType"

interface UserProfileContentProps {
  user: UserType
  isLocalUser?: boolean
}

export const UserProfileContent: React.FC<UserProfileContentProps> = ({ user, isLocalUser }) => {
  const t = useTranslations("ProfilePage.editProfile")
  const { onOpen } = useModal()

  return (
    <>
      <div className="flex items-center space-x-4">
        <UserAvatar src={user.avatar_url} name={user.full_name} className="size-12" />
        <div>
          <h1 itemProp="name" className="text-xl font-bold">
            {user.full_name}
          </h1>
          <span itemProp="alternateName" className="text-foreground/50">{`@${user.username}`}</span>
        </div>
      </div>
      {user.bio && (
        <Linkify>
          <div itemProp="description">{user.bio}</div>
        </Linkify>
      )}
      {isLocalUser && (
        <Button
          onClick={() => onOpen("edit-profile", { user })}
          variant="outline"
          className="w-full"
        >
          {t("openDialogButton")}
        </Button>
      )}
    </>
  )
}

export const UserProfileSkeleton = () => (
  <>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-6 w-36" />
    </div>
    <Skeleton className="mt-2 h-6 w-full" />
  </>
)
