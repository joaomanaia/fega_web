import Post from "@/app/components/post/Post"
import { MainContainer } from "@/app/components/m3/main-container"
import { getLocalUserUid } from "@/utils/user-utils"
import { notFound } from "next/navigation"
import type { PostViewType } from "@/types/PostType"
import { cache } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "next-intl"

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

  const localUid = await getLocalUserUid()

  return (
    <MainContainer className="lg:container mx-3 lg:mx-auto">
      <Post hideContainer post={post} localUid={localUid} className="p-2" />
    </MainContainer>
  )
}
