import { CalendarEvent, calendarEntityToModel } from "@/types/CalendarEvent"
import { MainContainer } from "../components/m3/main-container"
import { EventComponent } from "./components/event-component"
import { NextEventCover } from "./components/next-event-cover"
import { CalendarIcon } from "lucide-react"
import { createServerComponentClient } from "@/supabase"

const getEvents = async (): Promise<CalendarEvent[]> => {
  const supabase = createServerComponentClient()

  const now = new Date()

  const { data: events, error } = await supabase
    .from("calendar_events_view")
    .select("*")
    .gte("end_date", now.toISOString())
    .order("start_date", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return events.map(calendarEntityToModel)
}

export default async function EventsPage() {
  const events = await getEvents()

  if (events.length === 0) {
    return <EmptyEventsPage />
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <MainContainer className="flex flex-col-reverse lg:flex-row w-full items-center">
        <NextEventCover event={events[0]} />
      </MainContainer>
      {events.length > 1 && (
        <MainContainer className="flex flex-col space-y-4 my-3">
          <h2 className="text-2xl font-bold">Other Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {events.slice(1).map((event) => (
              <EventComponent key={event.id} event={event} />
            ))}
          </div>
        </MainContainer>
      )}
    </div>
  )
}

const EmptyEventsPage = () => {
  return (
    <MainContainer className="h-full mb-3 flex flex-col items-center justify-center">
      <div className="bg-surfaceVariant/40 text-surfaceVariant-foreground p-8 lg:p-12 rounded-full">
        <CalendarIcon className="size-20 lg:size-40" />
      </div>
      <h1 className="text-xl lg:text-2xl font-bold mt-8 text-center">
        There are no upcoming events.
      </h1>
    </MainContainer>
  )
}
