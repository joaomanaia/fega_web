import Post from "@/app/components/post/Post"
import { createServerComponentClient } from "@/supabase"
import { MainContainer } from "@/app/components/m3/main-container"
import { getLocalUserUid } from "@/utils/user-utils"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { notFound } from "next/navigation"
import type { PostViewType } from "@/types/PostType"

interface PostPageProps {
  params: {
    id: string
    lang: Locale
  }
}

const getPostById = async (id: string): Promise<PostViewType | null> => {
  const supabase = createServerComponentClient()

  const { data: post } = await supabase.from("posts_view").select("*").eq("id", id).single()

  return post
}

export const dynamic = "force-dynamic"

export default async function PostPage({ params }: PostPageProps) {
  const localUid = await getLocalUserUid()
  const post = await getPostById(params.id)
  const dictionary = await getDictionary(params.lang)

  if (!post) notFound()

  return (
    <MainContainer className="mx-3 md:mx-0">
      <Post
        hideContainer
        post={post}
        localUid={localUid}
        lang={params.lang}
        dictionary={dictionary}
      />
    </MainContainer>
  )
}
