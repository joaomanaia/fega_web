import { MainContainer } from "@/app/components/m3/main-container"
import { type Locale } from "@/i18n-config"
import { createServerComponentClient } from "@/supabase"
import { calendarEntityToModel, type CalendarEvent } from "@/types/CalendarEvent"
import { type Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
  title: "Events Map",
}

interface EventsMapPageProps {
  params: {
    lang: Locale
  }
}

const DynamicMap = dynamic(() => import("../components/event-map"), {
  loading: () => <div>Loading map...</div>,
  ssr: false,
})

const getAllEvents = async (): Promise<CalendarEvent[]> => {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("calendar_events_view").select("*")

  if (error) {
    console.error("Error fetching locations", error)
    return []
  }

  return data.map(calendarEntityToModel)
}

export default async function EventsMapPage({ params }: EventsMapPageProps) {
  const events = await getAllEvents()

  return (
    <MainContainer className="w-full h-full mb-3">
      <DynamicMap events={events} className="w-full h-full" />
    </MainContainer>
  )
}
