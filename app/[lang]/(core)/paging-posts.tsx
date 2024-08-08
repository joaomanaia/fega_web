"use client"

import Post from "@/app/components/post/Post"
import { useGetInfinitePosts } from "@/features/post/use-get-posts"
import type { Dictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import type { PostsWithData } from "@/types/PostType"
import { useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"

interface PagingPostsProps {
  uid?: string
  localUid: string | null
  initialPosts: PostsWithData
  lang: Locale
  dictionary: Dictionary
  schemaHasPart?: boolean
}

export const PagingPosts: React.FC<PagingPostsProps> = ({
  uid,
  localUid,
  initialPosts,
  lang,
  dictionary,
  schemaHasPart,
}) => {
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
            <Post
              post={post}
              localUid={localUid}
              postVotes={post.votes}
              authorName={post.full_name}
              authorAvatarUrl={post.avatar_url}
              localUserVotedType={post.vote_type}
              dictionary={dictionary}
              schemaHasPart={schemaHasPart}
              lang={lang}
            />
          </ul>
        ))}
      </li>

      {isFetchingNextPage && <p>{dictionary.post.loading}</p>}

      <div ref={ref} className="-my-2" />
    </>
  )
}
