import { MainContainer } from "@/app/components/m3/main-container"
import { calendarEntityToModel, type CalendarEvent } from "@/types/CalendarEvent"
import { type Metadata } from "next"
import dynamic from "next/dynamic"
import { EventsDateRangePicker } from "./components/events-daterange-picker"
import { type DateRange } from "react-day-picker"
import { createClient } from "@/lib/supabase/server"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

export const metadata: Metadata = {
  title: "Events Map",
}

interface EventsMapPageProps {
  params: Promise<{
    lang: Locale
  }>
  searchParams: Promise<{
    fromDate: string | undefined
    toDate: string | undefined
  }>
}

const DynamicMap = dynamic(() => import("../components/event-map"), {
  loading: () => <div>Loading map...</div>,
  ssr: !!false,
})

const getAllEvents = async (from?: Date, to?: Date): Promise<CalendarEvent[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("calendar_events_view")
    .select("*")
    .gte("end_date", from?.toISOString())
    .lte("start_date", to?.toISOString())

  if (error) {
    console.error("Error fetching locations", error)
    return []
  }

  return data.map(calendarEntityToModel)
}

const defaultDateRange: DateRange = {
  from: new Date(),
  to: new Date(new Date().getFullYear(), 11, 31),
}

const getDateRangeFromQuery = (from?: string, to?: string): DateRange | undefined => {
  if (!from || !to) {
    return
  }

  return {
    from: new Date(from),
    to: new Date(to),
  }
}

export default async function EventsMapPage(props: EventsMapPageProps) {
  const { lang } = await props.params
  // Enable static rendering
  setRequestLocale(lang)

  const searchParams = await props.searchParams
  const dateRange =
    getDateRangeFromQuery(searchParams.fromDate, searchParams.toDate) || defaultDateRange

  const events = await getAllEvents(dateRange.from, dateRange.to)

  return (
    <MainContainer className="flex flex-col gap-4 w-full h-full mb-3">
      <EventsDateRangePicker dateRange={dateRange} />
      <DynamicMap events={events} className="w-full h-full" />
    </MainContainer>
  )
}
