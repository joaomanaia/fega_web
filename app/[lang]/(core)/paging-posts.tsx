"use client"

import Post from "@/app/components/post/Post"
import { Button } from "@/components/ui/button"
import { useGetInfinitePosts } from "@/features/post/use-get-posts"
import type { Dictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import type { PostsWithData } from "@/types/PostType"
import { useMemo } from "react"

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
  const { data, fetchNextPage, hasNextPage } = useGetInfinitePosts(initialPosts, uid)

  const posts = useMemo(() => {
    return data.pages.flat()
  }, [data.pages])

  return (
    <>
      {posts?.map((post) => (
        <Post
          key={post.id}
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
      ))}

      {hasNextPage && <Button onClick={() => fetchNextPage()}>Load More</Button>}
    </>
  )
}
