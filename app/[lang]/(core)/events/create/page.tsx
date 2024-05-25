import { type Metadata } from "next"
import { getSession } from "@/utils/user-utils"
import { jwtDecode } from "jwt-decode"
import { redirect } from "next/navigation"
import { type Enums } from "@/types/database.types"
import { MainContainer } from "@/app/components/m3/main-container"
import { CreateEventForm } from "./components/create-event-form"

export const metadata: Metadata = {
  title: "Create Event",
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
      <h1 className="text-3xl">Create Event</h1>
      <CreateEventForm className="mt-4" />
    </MainContainer>
  )
}
