import { createServerComponentClient } from "@/supabase"
import { type Tables } from "@/types/database.types"
import { type Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"
import remarkGfm from "remark-gfm"

interface NewsIdPageProps {
  params: { newsId: string }
}

type NewsItemType = Tables<"news_view">

const getNewsItem = async (newsId: string): Promise<NewsItemType> => {
  const supabase = createServerComponentClient()

  const { data } = await supabase.from("news_view").select("*").eq("id", newsId).single()
  if (!data) notFound()

  return data
}

export async function generateMetadata({ params }: NewsIdPageProps): Promise<Metadata> {
  const newsId = params.newsId

  if (!newsId) {
    throw new Error("No newsId provided")
  }

  const newsItem = await getNewsItem(newsId)

  const authorProfileUrl = newsItem.created_by
    ? `https://fega.vercel.app/${newsItem.created_by}`
    : undefined

  return {
    title: newsItem.title,
    description: newsItem.description,
    openGraph: {
      type: "article",
      title: newsItem.title ?? undefined,
      description: newsItem.description ?? undefined,
      tags: newsItem.tags ?? undefined,
      images: newsItem.cover_image ?? undefined,
    },
    authors: authorProfileUrl
      ? {
          name: newsItem.author_full_name ?? undefined,
          url: authorProfileUrl,
        }
      : undefined,
  }
}

export default async function NewsIdPage({ params }: NewsIdPageProps) {
  const newsId = params.newsId

  if (!newsId) {
    return null
  }

  const newsItem = await getNewsItem(newsId)

  if (!newsItem.content) {
    return null
  }

  return (
    <MDXRemote
      source={newsItem.content}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  )
}
