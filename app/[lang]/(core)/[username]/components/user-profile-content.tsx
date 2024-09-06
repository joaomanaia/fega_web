"use client"

import { type Dictionary } from "@/get-dictionary"
import type UserType from "@/types/UserType"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"

interface UserProfileContentProps {
  user: UserType
  isLocalUser?: boolean
  dictionary: Dictionary
}

export const UserProfileContent: React.FC<UserProfileContentProps> = ({
  user,
  isLocalUser,
  dictionary,
}) => {
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
      {user.bio && <p itemProp="description">{user.bio}</p>}
      {isLocalUser && (
        <Button
          onClick={() => onOpen("edit-profile", { user })}
          variant="outline"
          className="w-full"
        >
          {dictionary.editProfileButton}
        </Button>
      )}
    </>
  )
}

export const UserProfileSkeleton = () => (
  <>
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="w-36 h-6" />
    </div>
    <Skeleton className="w-full h-6 mt-2" />
  </>
)
