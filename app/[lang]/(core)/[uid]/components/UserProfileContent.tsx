import { defaultImgUrl } from "@/core/common"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditProfileDialog } from "./edit-profile-dialog"
import { type Dictionary } from "@/get-dictionary"
import type UserType from "@/types/UserType"
import { Skeleton } from "@/components/ui/skeleton"

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
  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage itemProp="image" src={user.avatar_url ?? defaultImgUrl} />
          <AvatarFallback>{user.full_name}</AvatarFallback>
        </Avatar>
        <span itemProp="name" className="text-xl font-bold">
          {user.full_name}
        </span>
      </div>
      {user.bio && <p itemProp="description">{user.bio}</p>}
      {isLocalUser && <EditProfileDialog user={user} dictionary={dictionary} />}
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
