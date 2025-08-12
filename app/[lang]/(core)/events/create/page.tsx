import { type Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { MainContainer } from "@/app/components/m3/main-container"
import { verifyUserRole } from "@/lib/dal"
import { CreateEventForm } from "./components/create-event-form"

export const metadata: Metadata = {
  title: "Create Event",
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

  await verifyUserRole("admin")

  return (
    <MainContainer className="mb-3 h-full w-full overflow-y-auto">
      <h1 className="text-3xl">Create Event</h1>
      <CreateEventForm className="mt-4" />
    </MainContainer>
  )
}
