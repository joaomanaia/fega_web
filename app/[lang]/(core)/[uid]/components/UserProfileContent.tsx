import { createServerComponentClient } from "@/supabase"
import type UserType from "@/types/UserType"
import { defaultImgUrl } from "@/core/common"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EditProfileDialog } from "./edit-profile-dialog"
import { type Dictionary } from "@/get-dictionary"

const getUserByUid = async (uid: string): Promise<UserType | null> => {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", uid).single()

  if (error) {
    console.log(error)
    return null
  }

  return data
}

interface UserProfileContentProps {
  uid: string
  isLocalUser?: boolean
  dictionary: Dictionary
}

export const UserProfileContent: React.FC<UserProfileContentProps> = async ({
  uid,
  isLocalUser,
  dictionary,
}) => {
  const user = await getUserByUid(uid)

  if (!user) return <>User not found</>

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user.avatar_url ?? defaultImgUrl} />
          <AvatarFallback>{user.full_name}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold">{user.full_name}</h1>
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
