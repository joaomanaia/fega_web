import { createServerComponentClient } from "@/supabase"
import UserType from "@/types/UserType"
import Avatar from "../../components/m3/avatar"

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
}

export const UserProfileContent: React.FC<UserProfileContentProps> = async ({ uid }) => {
  const user = await getUserByUid(uid)

  if (!user) return <>User not found</>

  return (
    <div className="flex items-center space-x-4">
      <Avatar photoUrl={user.avatar_url} name={user.full_name} size={40} />
      <h1 className="text-xl font-bold">{user.full_name}</h1>
    </div>
  )
}
