import { SupabaseClient } from "@supabase/supabase-js"
import { ITEMS_PER_PAGE } from "@/features/post/constants"
import type { Database } from "@/types/database.types"
import type { PostViewType } from "@/types/PostType"

/**
 * Get posts from the database with pagination.
 *
 * @param uid an optional user id to filter posts by
 * @param page the page number
 * @returns a list of posts
 */
export const getPosts = async (
  client: SupabaseClient<Database>,
  uid?: string,
  page: number = 0
): Promise<PostViewType[]> => {
  const from = page * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  let query = client
    .from("posts_view")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (uid) {
    query = query.eq("uid", uid)
  }

  const { data: posts } = await query.throwOnError()

  return posts || []
}
