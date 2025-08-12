import { type Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { MainContainer } from "@/app/components/m3/main-container"
import { verifyUserRole } from "@/lib/dal"
import { CreateNewsForm } from "./components/create-news-form"

export const metadata: Metadata = {
  title: "Create News",
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

  await verifyUserRole("admin")

  return (
    <MainContainer className="mb-3 h-full w-full overflow-y-auto">
      <h1 className="text-3xl">Create News</h1>

      <CreateNewsForm className="mt-4" />
    </MainContainer>
  )
}
