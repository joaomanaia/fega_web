import MainContainer from "@/app/(core)/components/m3/MainContainer"
import { PostWithUser } from "@/types/PostType"
import Post from "../../components/post/Post"
import { createServerComponentClient } from "@/supabase"

interface PostPageProps {
  params: { id: string }
}

const getPostById = async (id: string): Promise<PostWithUser | null> => {
  const supabase = createServerComponentClient()

  const { data: post } = await supabase
    .from("posts")
    .select("*, author:users(*)")
    .eq("id", id)
    .single()

  return post as PostWithUser
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
        user={post.author}
      />
    </MainContainer>
  )
}
