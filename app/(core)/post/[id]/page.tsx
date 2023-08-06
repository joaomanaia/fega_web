import MainContainer from "@/components/m3/MainContainer"
import { PostWithUser } from "@/types/PostType"
import Post from "../../components/post/Post"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"
import { cookies } from "next/headers"

interface PostPageProps {
  params: { id: string }
}

const getPostById = async (id: string): Promise<PostWithUser | null> => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: post } = await supabase
    .from("posts")
    .select("*, author:users(*)")
    .eq("id", id)
    .single()

  return post as PostWithUser
}

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
