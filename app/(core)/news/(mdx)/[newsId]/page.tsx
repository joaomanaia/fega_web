import { createServerComponentClient } from "@/supabase"
import { Tables } from "@/types/database.types"
import { MDXRemote } from "next-mdx-remote/rsc"

interface NewsIdPageProps {
  params: { newsId: string }
}

type NewsItemType = Tables<"news">

const getNewsItem = async (newsId: string): Promise<NewsItemType> => {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("news").select("*").eq("id", newsId).single()

  if (error) {
    throw error
  }

  return data
}

export async function generateMetadata({ params }: NewsIdPageProps) {
  const newsId = params.newsId

  if (!newsId) {
    throw new Error("No newsId provided")
  }

  const newsItem = await getNewsItem(newsId)

  return {
    title: newsItem.title,
    description: newsItem.description,
  }
}

export default async function NewsIdPage({ params }: NewsIdPageProps) {
  const newsId = params.newsId

  if (!newsId) {
    return null
  }

  const newsItem = await getNewsItem(newsId)

  return <MDXRemote source={newsItem.content} />
}
