import { type Metadata } from "next"
import { CreateNewsForm } from "./components/create-news-form"
import { getSession } from "@/utils/user-utils"
import { jwtDecode } from "jwt-decode"
import { Enums } from "@/types/database.types"
import { MainContainer } from "@/app/components/m3/main-container"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { redirect } from "@/src/i18n/navigation"

export const metadata: Metadata = {
  title: "Create News",
}

interface SessionToken {
  user_role: Enums<"app_role">
}

interface NewNewsPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function NewNewsPage(props: NewNewsPageProps) {
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
      <h1 className="text-3xl">Create News</h1>

      <CreateNewsForm className="mt-4" />
    </MainContainer>
  )
}
