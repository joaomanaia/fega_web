import { createServerComponentClient } from "@/supabase"
import { PostsWithData } from "@/types/PostType"
import Post from "./components/post/Post"

const getPosts = async (): Promise<PostsWithData> => {
  const supabase = createServerComponentClient()

  const { data: posts } = await supabase
    .rpc("get_posts_with_data")
    .order("created_at", { ascending: false })

  return posts || []
}

export default async function PostsContent() {
  const posts = await getPosts()

  return (
    <>
      {posts?.map((post) => (
        <Post
          key={post.id}
          post={post}
          postVotes={post.votes}
          authorName={post.full_name}
          authorAvatarUrl={post.avatar_url}
          localUserVotedType={post.vote_type}
        />
      ))}
    </>
  )
}
