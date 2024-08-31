import type { Database } from "@/types/database.types"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { MetadataRoute, type Route } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const postsPages = await getPostsPages(client)

  return [
    addPage("/"),
    addPage("/news"),
    addPage("/cameras"),
    addPage("/events"),
    addPage("/events/map"),
    addPage("/events/q2"),
    addPage("/events/mO"),
    addPage("/events/oj"),
    addPage("/events/vm"),
    addPage("/cameras/figueiradafoz-panoramica"),
    addPage("/cameras/figueiradafoz-buarcos"),
    addPage("/cameras/figueiradafoz-cabedelo"),
    addPage("/cameras/hoteloslo-coimbra"),
    addPage("/news/44ec1283-f21f-4de8-bac5-abe90a360112"),
    ...postsPages,
  ]
}

type SitemapSingleItem = MetadataRoute.Sitemap[number]
type ChangeFrequency = SitemapSingleItem["changeFrequency"]

const siteUrl = "https://fega.vercel.app"

const addPage = (
  url: Route,
  changeFrequency?: ChangeFrequency,
  priority?: number,
  lastModified?: string | Date
): SitemapSingleItem => {
  return {
    url: `${siteUrl}${url}`,
    lastModified: lastModified,
    changeFrequency: changeFrequency,
    priority: priority,
    alternates: {
      languages: {
        pt: `${siteUrl}${url}`,
        en: `${siteUrl}/en${url}`,
      },
    },
  }
}

const getPostsPages = async (client: SupabaseClient) => {
  const { data: posts, error: postsError } = await client.from("posts").select("id")
  if (postsError) return []

  return posts.map((post) => addPage(`/post/${post.id}`))
}
