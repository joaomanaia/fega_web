import { type Metadata } from "next"
import { getSession } from "@/utils/user-utils"
import { jwtDecode } from "jwt-decode"
import { type Enums } from "@/types/database.types"
import { MainContainer } from "@/app/components/m3/main-container"
import { CreateEventForm } from "./components/create-event-form"
import { redirect } from "@/src/i18n/navigation"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "next-intl"

export const metadata: Metadata = {
  title: "Create Event",
}

interface SessionToken {
  user_role: Enums<"app_role">
}

interface NewEventsPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function NewEventsPage(props: NewEventsPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  const session = await getSession()
  if (!session) return redirect({ href: "/", locale: params.lang })

  const jwt = jwtDecode<SessionToken>(session.access_token)
  const userRole = jwt.user_role

  if (userRole !== "admin") return redirect({ href: "/", locale: params.lang })

  return (
    <MainContainer className="w-full h-full mb-3 overflow-y-auto">
      <h1 className="text-3xl">Create Event</h1>
      <CreateEventForm className="mt-4" />
    </MainContainer>
  )
}
