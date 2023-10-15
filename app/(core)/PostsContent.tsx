import { createServerComponentClient } from "@/supabase"
import { PostsWithData } from "@/types/PostType"
import Post from "./components/post/Post"

/**
 * Get posts from the database.
 *
 * @param uid an optional user id to filter posts by
 * @returns a list of posts
 */
const getPosts = async (uid?: string): Promise<PostsWithData> => {
  const supabase = createServerComponentClient()

  if (uid) {
    const { data: posts } = await supabase
      .rpc("get_posts_with_data")
      .eq("uid", uid)
      .order("created_at", { ascending: false })

    return posts || []
  }

  const { data: posts } = await supabase
    .rpc("get_posts_with_data")
    .order("created_at", { ascending: false })

  return posts || []
}

export default async function PostsContent({ uid }: { uid?: string }) {
  const posts = await getPosts(uid)

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
