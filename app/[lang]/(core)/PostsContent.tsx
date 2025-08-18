import { FileWarningIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { PagingPosts } from "@/app/[lang]/(core)/paging-posts"
import { PostSkeleton } from "@/app/components/post/Post"
import { getPosts } from "@/features/post/get-posts"
import { createClient } from "@/lib/supabase/server"

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
    <div className="flex h-full flex-col items-center justify-center">
      <FileWarningIcon className="text-secondary/50 mb-4 h-16 w-16" />
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
