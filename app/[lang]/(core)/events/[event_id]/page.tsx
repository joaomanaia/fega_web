import { cache, Suspense } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { type Metadata } from "next"
import { MDXRemote, type MDXComponents } from "next-mdx-remote-client/rsc"
import remarkGfm from "remark-gfm"
import { DateLocationText } from "@/app/[lang]/(core)/events/_components/date-location-text"
import { MainContainer } from "@/app/components/m3/main-container"
import { createClient } from "@/lib/supabase/server"
import { calendarEntityToModel, type CalendarEvent } from "@/types/CalendarEvent"
import { createEventJsonLd } from "../utils/eventMetadataUtil"
import { Directions } from "./_components/directions"
import { MoreInfo } from "./_components/more-info"

interface EventIdPageProps {
  params: Promise<{
    event_id: string
  }>
}

const getEventById = cache(async (shortId: string): Promise<CalendarEvent | null> => {
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from("calendar_events_view")
    .select("*")
    .eq("short_id", shortId)
    .single()

  if (error) {
    return null
  }

  return calendarEntityToModel(event)
})

export async function generateMetadata(props: EventIdPageProps): Promise<Metadata> {
  const params = await props.params
  const eventId = params.event_id

  const event = await getEventById(eventId)

  if (!event) {
    notFound()
  }

  return {
    title: event?.title,
    description: event?.description,
    openGraph: {
      title: event?.title,
      description: event?.description ?? undefined,
      images: event?.coverImage,
      url: `/events/${event.id}`,
    },
  }
}

const components: MDXComponents = {
  wrapper: function ({ children }: React.ComponentPropsWithoutRef<"div">) {
    return <div className="prose dark:prose-invert mt-4">{children}</div>
  },
}

export default async function EventIdPage(props: EventIdPageProps) {
  const params = await props.params
  const event = await getEventById(params.event_id)

  if (!event) {
    notFound()
  }

  const jsonLd = createEventJsonLd(event)

  return (
    <MainContainer className="mb-3 flex h-full flex-col items-center overflow-x-hidden overflow-y-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative aspect-video w-full lg:w-2/3">
        <Image
          src={event.coverImage}
          alt="Next Event Cover"
          layout="fill"
          className="rounded-3xl object-cover"
        />
      </div>

      <div className="mt-4 flex w-full flex-col items-start lg:mt-6 lg:w-2/3 xl:mt-8">
        <DateLocationText
          startDate={event.startDate}
          endDate={event.endDate}
          location={event.location}
        />

        <Suspense fallback={<div className="mt-4">Loading content...</div>}>
          <MDXRemote
            source={event.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
            components={components}
            onError={({ error }) => (
              <>
                <p className="text-destructive">Error loading content: {error.message}</p>
              </>
            )}
          />
        </Suspense>

        <Directions event={event} />

        {event.otherData.length > 0 && <MoreInfo data={event.otherData} />}
      </div>
    </MainContainer>
  )
}
