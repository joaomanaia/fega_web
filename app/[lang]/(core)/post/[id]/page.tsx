import { cache } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { MainContainer } from "@/app/components/m3/main-container"
import Post from "@/app/components/post/Post"
import { getSession } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import type { PostViewType } from "@/types/PostType"

interface PostPageProps {
  params: Promise<{
    id: string
    lang: Locale
  }>
}

const getPostById = cache(async (id: string): Promise<PostViewType | null> => {
  const supabase = await createClient()

  const { data: post, error } = await supabase.from("posts_view").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return post
})

export async function generateMetadata(props: PostPageProps): Promise<Metadata> {
  const params = await props.params
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  const title = `${post.author_full_name}: "${post.description}"`
  const images = post.images?.length ? post.images : post.author_avatar_url

  return {
    title: title,
    description: null,
    openGraph: {
      type: "website",
      title: title,
      siteName: "Fega",
      url: `/post/${params.id}`,
      images: images || undefined,
    },
  }
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  const post = await getPostById(params.id)
  if (!post) {
    notFound()
  }

  const session = await getSession()

  return (
    <MainContainer className="mx-3 lg:container lg:mx-auto">
      <Post hideContainer post={post} localUid={session?.uid ?? null} className="p-2" />
    </MainContainer>
  )
}
