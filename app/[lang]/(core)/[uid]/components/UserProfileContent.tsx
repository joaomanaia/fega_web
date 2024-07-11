import { defaultImgUrl } from "@/core/common"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EditProfileDialog } from "./edit-profile-dialog"
import { type Dictionary } from "@/get-dictionary"
import type UserType from "@/types/UserType"

interface UserProfileContentProps {
  user: UserType
  isLocalUser?: boolean
  dictionary: Dictionary
}

export const UserProfileContent: React.FC<UserProfileContentProps> = async ({
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
      {isLocalUser && <EditProfileDialog user={user} dictionary={dictionary} />}
    </>
  )
}

const EditProfileButton: React.FC = () => {
  return (
    <Link href="/edit-profile" className="next-link">
      <Button variant="outline" className="w-full">
        Edit Profile
      </Button>
    </Link>
  )
}
