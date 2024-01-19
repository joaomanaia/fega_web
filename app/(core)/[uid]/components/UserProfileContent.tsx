import { createServerComponentClient } from "@/supabase"
import UserType from "@/types/UserType"
import Avatar from "../../components/m3/avatar"
import { defaultImgUrl } from "@/core/common"
import { Button } from "@mui/material"
import Link from "next/link"

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
}

export const UserProfileContent: React.FC<UserProfileContentProps> = async ({
  uid,
  isLocalUser,
}) => {
  const user = await getUserByUid(uid)

  if (!user) return <>User not found</>

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar photoUrl={user.avatar_url ?? defaultImgUrl} name={user.full_name} size={40} />
        <h1 className="text-xl font-bold">{user.full_name}</h1>
      </div>
      {isLocalUser && <EditProfileButton />}
    </>
  )
}

const EditProfileButton: React.FC = () => {
  return (
    <Link href="/edit-profile" className="next-link">
      <Button variant="outlined" className="w-full">
        Edit Profile
      </Button>
    </Link>
  )
}