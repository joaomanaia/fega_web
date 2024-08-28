import Post from "@/app/components/post/Post"
import { createServerComponentClient } from "@/supabase"
import { MainContainer } from "@/app/components/m3/main-container"
import { getLocalUserUid } from "@/utils/user-utils"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { notFound } from "next/navigation"
import type { PostViewType } from "@/types/PostType"
import { cache } from "react"
import type { Metadata } from "next"

interface PostPageProps {
  params: {
    id: string
    lang: Locale
  }
}

const getPostById = cache(async (id: string): Promise<PostViewType | null> => {
  const supabase = createServerComponentClient()

  const { data: post, error } = await supabase.from("posts_view").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return post
})

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
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

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id)
  if (!post) {
    notFound()
  }

  const localUid = await getLocalUserUid()
  const dictionary = await getDictionary(params.lang)

  return (
    <MainContainer className="lg:container mx-3 lg:mx-auto">
      <Post
        hideContainer
        post={post}
        localUid={localUid}
        lang={params.lang}
        dictionary={dictionary}
        className="p-2"
      />
    </MainContainer>
  )
}
