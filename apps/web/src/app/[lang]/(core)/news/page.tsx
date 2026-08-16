import { NewspaperIcon } from "lucide-react"
import { type Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { MainContainer } from "@/app/components/m3/main-container"
import { createClient } from "@/lib/supabase/server"
import { type Tables } from "@/types/database.types"
import { NewsItem } from "./components/news-item"

type NewsItemType = Tables<"news_view">

const getNews = async (): Promise<NewsItemType[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("news_view")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    throw error
  }

  return data ?? []
}

export const metadata: Metadata = {
  title: "News",
  description: "Find out the latest news about the community of the app.",
}

export default async function NewsPage() {
  const t = await getTranslations("NewsPage")

  const news = await getNews()

  if (!news.length) {
    return <EmptyEventsPage emptyNewsText={t("emptyNewsPage")} />
  }

  return (
    <MainContainer className="h-full w-full overflow-y-scroll rounded-b-none md:mb-3 md:rounded-b-3xl">
      <h1 className="hidden">{t("header")}</h1>
      <ul className="grid h-full w-full grid-cols-1 items-start gap-2 lg:grid-cols-2 xl:grid-cols-3">
        {news.map((item) => (
          <li key={item.id}>
            <NewsItem news={item} />
          </li>
        ))}
      </ul>
    </MainContainer>
  )
}

interface EmptyEventsPageProps {
  emptyNewsText: string
}

const EmptyEventsPage: React.FC<EmptyEventsPageProps> = ({ emptyNewsText }) => {
  return (
    <MainContainer className="mb-3 flex h-full flex-col items-center justify-center">
      <div className="bg-surface-variant/40 text-surface-variant-foreground rounded-full p-8 lg:p-12">
        <NewspaperIcon className="size-20 lg:size-40" />
      </div>
      <h1 className="mt-8 text-center text-xl font-bold lg:text-2xl">{emptyNewsText}</h1>
    </MainContainer>
  )
}
