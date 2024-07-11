import { createServerComponentClient } from "@/supabase"
import { type PostsWithData } from "@/types/PostType"
import { PagingPosts } from "./paging-posts"
import { type Dictionary } from "@/get-dictionary"

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

interface PostsContentProps {
  uid?: string
  localUid: string | null
  dictionary: Dictionary
  schemaHasPart?: boolean
}

export default async function PostsContent({
  uid,
  localUid,
  dictionary,
  schemaHasPart,
}: PostsContentProps) {
  const posts = await getPosts(uid)

  if (!posts.length) {
    return <p>No posts yet</p>
  }

  return (
    <>
      <PagingPosts
        uid={uid}
        localUid={localUid}
        initialPosts={posts}
        dictionary={dictionary}
        schemaHasPart={schemaHasPart}
      />
    </>
  )
}
