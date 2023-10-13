import MainContainer from "@/app/(core)/components/m3/MainContainer"
import { PostWithData, PostsWithData } from "@/types/PostType"
import Post from "../../components/post/Post"
import { createServerComponentClient } from "@/supabase"

interface PostPageProps {
  params: { id: string }
}

const getPostById = async (id: string): Promise<PostWithData | null> => {
  const supabase = createServerComponentClient()

  const { data: post } = await supabase.rpc("get_posts_with_data").eq("id", id).single()

  return post
}

export const dynamic = "force-dynamic"

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id)

  if (!post) return <MainContainer>Post not found</MainContainer>

  return (
    <MainContainer>
      <Post
        hideContainer
        post={post}
        postVotes={post.votes}
        authorName={post.full_name}
        authorAvatarUrl={post.avatar_url}
        localUserVotedType={post.vote_type}
      />
    </MainContainer>
  )
}
