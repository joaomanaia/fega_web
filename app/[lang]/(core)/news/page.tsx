import { Metadata } from "next"
import { NewsItem } from "./components/NewsItem"
import { MainContainer } from "@/app/components/m3/main-container"
import { Tables } from "@/types/database.types"
import { createServerComponentClient } from "@/supabase"

type NewsItemType = Tables<"news">

const getNews = async (): Promise<NewsItemType[]> => {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export const metadata: Metadata = {
  title: "News",
  description: "News page",
}

export default async function Page() {
  const news = await getNews()

  return (
    <MainContainer className="w-full h-full md:mb-3 rounded-b-none md:rounded-[30px] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-3 overflow-auto">
      {news.map((item) => (
        <NewsItem
          key={item.id}
          id={item.id}
          title={item.title}
          mainImage={item.cover_image}
          description={item.description}
        />
      ))}
    </MainContainer>
  )
}
