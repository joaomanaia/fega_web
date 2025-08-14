import { type CalendarEvent, calendarEntityToModel } from "@/types/CalendarEvent"
import { MainContainer } from "@/app/components/m3/main-container"
import { EventComponent } from "./components/event-component"
import { NextEventCover } from "./components/next-event-cover"
import { CalendarIcon, MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Hint } from "@/components/hint"
import { type Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/src/i18n/navigation"

export const metadata: Metadata = {
  title: "Events",
}

const getEvents = async (): Promise<CalendarEvent[]> => {
  const supabase = await createClient()

  const now = new Date()

  const { data: events, error } = await supabase
    .from("calendar_events_view")
    .select("*")
    .gte("end_date", now.toISOString())
    .order("start_date", { ascending: true })

  if (error) return []

  return events.map(calendarEntityToModel)
}

interface EventsPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function EventsPage(props: EventsPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)
  const t = await getTranslations("EventsPage")

  const events = await getEvents()

  if (events.length === 0) {
    return <EmptyEventsPage headerText={t("emptyEventsPage")} />
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <MainContainer className="flex flex-col-reverse lg:flex-row w-full items-center">
        <NextEventCover event={events[0]} />
      </MainContainer>
      {events.length > 1 && (
        <MainContainer className="flex flex-col space-y-4 my-3">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">{t("otherEvents")}</h2>
            <Hint label={t("eventsMap")}>
              <Button variant="ghost" className="text-foreground" size="icon" asChild>
                <Link href="/events/map">
                  <MapIcon />
                </Link>
              </Button>
            </Hint>
          </div>
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

interface EmptyEventsPageProps {
  headerText: string
}

const EmptyEventsPage: React.FC<EmptyEventsPageProps> = ({ headerText }) => {
  return (
    <MainContainer className="h-full mb-3 flex flex-col items-center justify-center">
      <div className="bg-surface-variant/40 text-surface-variant-foreground p-8 lg:p-12 rounded-full">
        <CalendarIcon className="size-20 lg:size-40" />
      </div>
      <h1 className="text-xl lg:text-2xl font-bold mt-8 text-center">{headerText}</h1>
    </MainContainer>
  )
}
