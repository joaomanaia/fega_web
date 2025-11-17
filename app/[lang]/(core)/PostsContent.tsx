import { FileTextIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
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
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon />
        </EmptyMedia>
        <EmptyTitle>{t("header")}</EmptyTitle>
        <EmptyDescription>{t("description.default")}</EmptyDescription>
      </EmptyHeader>
    </Empty>
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
