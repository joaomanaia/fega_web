import { redirect } from "next/navigation"
import MainContainer from "../components/m3/MainContainer"
import UserType from "@/types/UserType"
import { createServerComponentClient } from "@/supabase"
import { EditProfileForm } from "./components/EditProfileForm"

const getLocalUser = async (): Promise<UserType | null> => {
  const supabase = createServerComponentClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const uid = authUser.id

  const { data: user, error } = await supabase.from("users").select("*").eq("id", uid).single()

  if (error) {
    console.log(error)
    return null
  }

  return user
}

export default async function EditProfilePage() {
  const user = await getLocalUser()
  if (!user) return redirect("/")

  return (
    <MainContainer className="flex justify-center ">
      <EditProfileForm user={user} />
    </MainContainer>
  )
}
