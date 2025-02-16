import { type Metadata } from "next"
import { NewsItem } from "./components/news-item"
import { MainContainer } from "@/app/components/m3/main-container"
import { type Tables } from "@/types/database.types"
import { getDictionary, type Dictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import { NewspaperIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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

interface NewsPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function NewsPage(props: NewsPageProps) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)
  const news = await getNews()

  if (!news.length) {
    return <EmptyEventsPage dictionary={dictionary} />
  }

  return (
    <MainContainer className="w-full h-full rounded-b-none md:rounded-b-3xl md:mb-3 overflow-y-scroll">
      <h1 className="hidden">{dictionary.navdrawer.news}</h1>
      <ul className="w-full h-full items-start gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {news.map((item) => (
          <li key={item.id}>
            <NewsItem news={item} lang={params.lang} />
          </li>
        ))}
      </ul>
    </MainContainer>
  )
}

interface EmptyEventsPageProps {
  dictionary: Dictionary
}

const EmptyEventsPage: React.FC<EmptyEventsPageProps> = ({ dictionary }) => {
  return (
    <MainContainer className="h-full mb-3 flex flex-col items-center justify-center">
      <div className="bg-surfaceVariant/40 text-surfaceVariant-foreground p-8 lg:p-12 rounded-full">
        <NewspaperIcon className="size-20 lg:size-40" />
      </div>
      <h1 className="text-xl lg:text-2xl font-bold mt-8 text-center">
        {dictionary.news.emptyNewsPage}
      </h1>
    </MainContainer>
  )
}
