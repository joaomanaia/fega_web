import { type CalendarEvent, calendarEntityToModel } from "@/types/CalendarEvent"
import { MainContainer } from "@/app/components/m3/main-container"
import Image from "next/image"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { DateText } from "../components/date-text"
import { MoreInfo } from "./components/more-info"
import { Directions } from "./components/directions"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { createServerComponentClient } from "@/supabase"
import { type Metadata } from "next"
import { createEventJsonLd } from "../utils/eventMetadataUtil"

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

export async function generateMetadata({ params }: EventIdPageProps): Promise<Metadata> {
  const eventId = params.event_id

  if (!eventId) {
    throw new Error("No newsId provided")
  }

  const event = await getEventById(eventId)

  const images = event?.coverImage ? [event.coverImage] : []

  return {
    title: event?.title,
    description: event?.description,
    openGraph: {
      title: event?.title,
      description: event?.description,
      images: images,
    },
  }
}

export default async function EventIdPage({ params }: EventIdPageProps) {
  const event = await getEventById(params.event_id)

  if (!event) {
    return <h1>Event not found</h1>
  }

  const jsonLd = createEventJsonLd(event)

  return (
    <MainContainer className="flex flex-col items-center h-full mb-3 overflow-y-auto overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative w-full aspect-video lg:w-2/3">
        <Image
          src={event.coverImage}
          alt="Next Event Cover"
          layout="fill"
          className="rounded-3xl object-cover"
        />
      </div>

      <div className="flex flex-col w-full lg:w-2/3 mt-4 lg:mt-6 xl:mt-8 items-start">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center justify-center gap-2">
            <CalendarIcon className="size-5" />
            <DateText startDate={event.startDate} endDate={event.endDate} />
          </div>
          <span>&bull;</span>
          <div className="flex items-center justify-center gap-2">
            <MapPinIcon className="size-5" />
            <span>{event.location.name}</span>
          </div>
        </div>

        <div className="prose dark:prose-invert mt-4">
          <MDXRemote
            source={event.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>

        <Directions event={event} />

        {event.otherData && <MoreInfo data={event.otherData} />}
      </div>
    </MainContainer>
  )
}

// <h1 className="text-2xl lg:text-4xl xl:text-5xl w-full font-bold mt-4">{event.title}</h1>
