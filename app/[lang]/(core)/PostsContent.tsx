import { FileWarningIcon } from "lucide-react"
import { getPosts } from "@/features/post/get-posts"
import { PagingPosts } from "@/app/[lang]/(core)/paging-posts"
import { createClient } from "@/lib/supabase/server"
import { PostSkeleton } from "@/app/components/post/Post"
import { useTranslations } from "next-intl"

interface PostsContentProps {
  uid?: string
  localUid: string | null
  schemaHasPart?: boolean
  EmptyPostsContent?: () => React.ReactNode
}

export default async function PostsContent({
  uid,
  localUid,
  schemaHasPart,
  EmptyPostsContent = () => <DefaultEmptyPostsContent />,
}: PostsContentProps) {
  const client = await createClient()
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
        schemaHasPart={schemaHasPart}
      />
    </>
  )
}

const DefaultEmptyPostsContent = () => {
  const t = useTranslations("Post.emptyPosts")

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <FileWarningIcon className="w-16 h-16 text-secondary/50 mb-4" />
      <h2 className="text-xl font-semibold">{t("header")}</h2>
      <p className="text-secondary/50 mt-2">{t("description.default")}</p>
    </div>
  )
}

export function PostsSkeleton() {
  return (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  )
}
