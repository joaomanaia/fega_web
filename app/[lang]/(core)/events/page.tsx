import { cache } from "react"
import { CalendarIcon, MapIcon } from "lucide-react"
import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getNow, getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { MainContainer } from "@/app/components/m3/main-container"
import { Hint } from "@/components/hint"
import Link from "@/components/link"
import { createClient } from "@/lib/supabase/server"
import { calendarEntityToModel, type CalendarEvent } from "@/types/CalendarEvent"
import { EventComponent } from "./_components/event-component"
import { NextEventCover } from "./_components/next-event-cover"

export const metadata: Metadata = {
  title: "Events",
}

const getEvents = cache(async (): Promise<CalendarEvent[]> => {
  const supabase = await createClient()
  const now = await getNow()

  const { data: events, error } = await supabase
    .from("calendar_events_view")
    .select("*")
    .gte("end_date", now.toISOString())
    .order("start_date", { ascending: true })

  if (error) return []

  return events.map(calendarEntityToModel)
})

export default async function EventsPage(props: PageProps<"/[lang]/events">) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang as Locale)

  const events = await getEvents()
  const t = await getTranslations("EventsPage")

  if (events.length === 0) {
    return <EmptyEventsPage headerText={t("emptyEventsPage")} />
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <MainContainer className="flex w-full flex-col-reverse items-center lg:flex-row">
        <NextEventCover event={events[0]} />
      </MainContainer>
      {events.length > 1 && (
        <MainContainer className="my-3 flex flex-col space-y-4">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
    <MainContainer className="mb-3 flex h-full flex-col items-center justify-center">
      <div className="bg-surface-variant/40 text-surface-variant-foreground rounded-full p-8 lg:p-12">
        <CalendarIcon className="size-20 lg:size-40" />
      </div>
      <h1 className="mt-8 text-center text-xl font-bold lg:text-2xl">{headerText}</h1>
    </MainContainer>
  )
}
