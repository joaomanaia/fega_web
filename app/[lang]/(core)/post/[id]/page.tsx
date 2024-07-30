import { type PostWithData } from "@/types/PostType"
import Post from "@/app/components/post/Post"
import { createServerComponentClient } from "@/supabase"
import { MainContainer } from "@/app/components/m3/main-container"
import { getLocalUserUid } from "@/utils/user-utils"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { notFound } from "next/navigation"

interface PostPageProps {
  params: {
    id: string
    lang: Locale
  }
}

const getPostById = async (id: string): Promise<PostWithData | null> => {
  const supabase = createServerComponentClient()

  const { data: post } = await supabase.rpc("get_posts_with_data").eq("id", id).single()

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
        postVotes={post.votes}
        authorName={post.full_name}
        authorAvatarUrl={post.avatar_url}
        localUserVotedType={post.vote_type}
        lang={params.lang}
        dictionary={dictionary}
      />
    </MainContainer>
  )
}
