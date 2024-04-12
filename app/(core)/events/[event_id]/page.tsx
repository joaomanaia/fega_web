import { CalendarEvent, calendarEntityToModel } from "@/types/CalendarEvent"
import { MainContainer } from "../../components/m3/main-container"
import Image from "next/image"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { DateText } from "../components/date-text"
import { MoreInfo } from "./components/more-info"
import { Directions } from "./components/directions"
import { MDXRemote } from "next-mdx-remote/rsc"
import { createServerComponentClient } from "@/supabase"

interface EventIdPageProps {
  params: {
    event_id: string
  }
}

const getEventById = async (shortId: string): Promise<CalendarEvent | null> => {
  const supabase = createServerComponentClient()

  const { data: event, error } = await supabase
    .from("calendar_events_view")
    .select("*")
    .eq("short_id", shortId)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return calendarEntityToModel(event)
}

export default async function EventIdPage({ params }: EventIdPageProps) {
  const event = await getEventById(params.event_id)

  if (!event) {
    return <h1>Event not found</h1>
  }

  return (
    <MainContainer className="flex flex-col items-center h-full mb-3 overflow-y-auto">
      <div className="relative w-full lg:w-2/3 aspect-video">
        <Image
          src={event.coverImage}
          alt="Next Event Cover"
          layout="fill"
          className="rounded-3xl object-cover"
        />
      </div>

      <div className="flex flex-col w-full lg:w-2/3 mt-4 lg:mt-6 xl:mt-8 items-start">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="size-5" />
          <DateText startDate={event.startDate} endDate={event.endDate} />
          <span>&bull;</span>
          <MapPinIcon className="size-5" />
          <span>{event.location.name}</span>
        </div>

        <div className="prose dark:prose-invert mt-4">
          <MDXRemote source={event.content} />
        </div>

        <Directions location={event.location} />

        {event.otherData && <MoreInfo data={event.otherData} />}
      </div>
    </MainContainer>
  )
}

// <h1 className="text-2xl lg:text-4xl xl:text-5xl w-full font-bold mt-4">{event.title}</h1>
