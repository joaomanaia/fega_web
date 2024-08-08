import { type Dictionary } from "@/get-dictionary"
import { FileWarningIcon } from "lucide-react"
import { type Locale } from "@/i18n-config"
import { getPosts } from "@/features/post/get-posts"
import { createServerComponentClient } from "@/supabase"
import { PagingPosts } from "@/app/[lang]/(core)/paging-posts"

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
  const client = createServerComponentClient()
  const posts = await getPosts(client, uid)

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
