import { createServerComponentClient } from "@/supabase"
import { type PostsWithData } from "@/types/PostType"
import { PagingPosts } from "./paging-posts"
import { type Dictionary } from "@/get-dictionary"
import { FileWarningIcon } from "lucide-react"
import { type Locale } from "@/i18n-config"

const ITEMS_PER_PAGE = 7

/**
 * Get posts from the database.
 *
 * @param uid an optional user id to filter posts by
 * @returns a list of posts
 */
const getPosts = async (uid?: string): Promise<PostsWithData> => {
  const supabase = createServerComponentClient()

  let query = supabase
    .rpc("get_posts_with_data")
    .order("created_at", { ascending: false })
    .range(0, ITEMS_PER_PAGE - 1) // Get the first page

  if (uid) {
    query = query.eq("uid", uid)
  }

  const { data: posts } = await query

  return posts || []
}

interface PostsContentProps {
  uid?: string
  localUid: string | null
  lang: Locale
  dictionary: Dictionary
  schemaHasPart?: boolean
  EmptyPostsContent?: () => React.ReactNode
}

export default async function PostsContent({
  uid,
  localUid,
  lang,
  dictionary,
  schemaHasPart,
  EmptyPostsContent = DefaultEmptyPostsContent,
}: PostsContentProps) {
  const posts = await getPosts(uid)

  if (!posts.length) {
    return <EmptyPostsContent />
  }

  return (
    <>
      <PagingPosts
        uid={uid}
        localUid={localUid}
        initialPosts={posts}
        lang={lang}
        dictionary={dictionary}
        schemaHasPart={schemaHasPart}
      />
    </>
  )
}

const DefaultEmptyPostsContent = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <FileWarningIcon className="w-16 h-16 text-secondary/50 mb-4" />
    <h2 className="text-xl font-semibold">No posts yet</h2>
    <p className="text-secondary/50 mt-2">Start by creating your first post or check back later</p>
  </div>
)
