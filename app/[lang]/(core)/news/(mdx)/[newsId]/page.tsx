import { createClient } from "@/lib/supabase/server"
import { type Tables } from "@/types/database.types"
import { type Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"
import { cache } from "react"
import remarkGfm from "remark-gfm"

interface NewsIdPageProps {
  params: Promise<{ newsId: string }>
}

type NewsItemType = Tables<"news_view">

const getNewsItem = cache(async (newsId: string): Promise<NewsItemType> => {
  const supabase = await createClient()

  const { data } = await supabase.from("news_view").select("*").eq("id", newsId).single()
  if (!data) notFound()

  return data
})

export async function generateMetadata(props: NewsIdPageProps): Promise<Metadata> {
  const params = await props.params
  const newsId = params.newsId

  const newsItem = await getNewsItem(params.newsId)

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
      url: `/news/${newsId}`,
    },
    authors: authorProfileUrl
      ? {
          name: newsItem.author_full_name ?? undefined,
          url: authorProfileUrl,
        }
      : undefined,
  }
}

export default async function NewsIdPage(props: NewsIdPageProps) {
  const params = await props.params
  const newsItem = await getNewsItem(params.newsId)

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
