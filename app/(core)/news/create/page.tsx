import { MainContainer } from "@/app/(core)/components/m3/main-container"
import { type Metadata } from "next"
import { CreateNewsForm } from "./components/create-news-form"
import { getSession } from "@/utils/user-utils"
import { jwtDecode } from "jwt-decode"
import { redirect } from "next/navigation"
import { Enums } from "@/types/database.types"

export const metadata: Metadata = {
  title: "Create News",
}

interface SessionToken {
  user_role: Enums<"app_role">
}

export default async function NewNewsPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const jwt = jwtDecode<SessionToken>(session.access_token)
  const userRole = jwt.user_role

  if (userRole !== "admin") redirect("/")

  return (
    <MainContainer className="w-full h-full mb-3 overflow-y-auto">
      <h1 className="text-3xl">Create News</h1>

      <CreateNewsForm className="mt-4" />
    </MainContainer>
  )
}
