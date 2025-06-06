"use client"

import Post from "@/app/components/post/Post"
import { useGetInfinitePosts } from "@/features/post/use-get-posts"
import type { PostViewType } from "@/types/PostType"
import { useTranslations } from "next-intl"
import { useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"

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

  const posts = useMemo(() => {
    return data.pages.flat()
  }, [data.pages])

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  return (
    <>
      <li className="flex flex-col gap-y-4 md:gap-y-6">
        {posts?.map((post) => (
          <ul key={post.id}>
            <Post post={post} localUid={localUid} schemaHasPart={schemaHasPart} />
          </ul>
        ))}
      </li>

      {isFetchingNextPage && <p>{t("loading")}</p>}

      <div ref={ref} className="-my-2" />
    </>
  )
}
