import { createServerComponentClient } from "@/supabase"
import { PostsWithData } from "@/types/PostType"
import { PagingPosts } from "./paging-posts"

const ITEMS_PER_PAGE = 7

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
      .range(0, ITEMS_PER_PAGE - 1) // Get the first page

    return posts || []
  }

  const { data: posts } = await supabase
    .rpc("get_posts_with_data")
    .order("created_at", { ascending: false })
    .range(0, ITEMS_PER_PAGE - 1) // Get the first page

  return posts || []
}

export default async function PostsContent({ uid }: { uid?: string }) {
  const posts = await getPosts(uid)

  if (!posts.length) {
    return <p>No posts yet</p>
  }

  return (
    <>
      <PagingPosts uid={uid} initialPosts={posts} />
    </>
  )
}
