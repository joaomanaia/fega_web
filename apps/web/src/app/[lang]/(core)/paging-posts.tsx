"use client"

import { useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useInView } from "react-intersection-observer"
import Post, { PostSkeleton } from "@/app/components/post/Post"
import { useGetInfinitePosts } from "@/features/post/use-get-posts"
import type { PostViewType } from "@/types/PostType"

interface PagingPostsProps {
  uid?: string
  localUid: string | null
  initialPosts: PostViewType[]
  schemaHasPart?: boolean
}

export const PagingPosts: React.FC<PagingPostsProps> = ({
  uid,
  localUid,
  initialPosts,
  schemaHasPart,
}) => {
  const t = useTranslations("Post")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } = useGetInfinitePosts(
    initialPosts,
    uid
  )

  const { ref, inView } = useInView({
    threshold: 0.9,
    skip: isFetchingNextPage || !hasNextPage || isError,
    delay: 500,
  })

  const posts = useMemo(() => data.pages.flat(), [data.pages])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isError) {
    return <p className="text-error">{t("errorLoadingPosts")}</p>
  }

  return (
    <>
      <ul className="flex flex-col gap-y-4 md:gap-y-6">
        {posts.map((post) => (
          <li key={post.id}>
            <Post post={post} localUid={localUid} schemaHasPart={schemaHasPart} />
          </li>
        ))}
      </ul>

      {isFetchingNextPage && <PostSkeleton />}

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-1" />
    </>
  )
}
