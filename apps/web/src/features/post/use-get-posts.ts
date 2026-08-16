"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { ITEMS_PER_PAGE } from "@/features/post/constants"
import { getPosts } from "@/features/post/get-posts"
import { createClient } from "@/lib/supabase/client"
import type { PostViewType } from "@/types/PostType"

export const useGetInfinitePosts = (initialPosts: PostViewType[], uid?: string) => {
  const client = createClient()

  return useInfiniteQuery({
    queryKey: uid ? ["posts", uid] : ["posts"],
    queryFn: ({ pageParam }) => getPosts(client, uid, pageParam),
    // Load the first page of posts immediately and use it as initial data
    initialData: {
      pages: [initialPosts],
      pageParams: [0],
    },
    initialPageParam: 0, // Start at page 0
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // If the last page is less than ITEMS_PER_PAGE, there are no more pages to fetch,
      // otherwise, return the next page number
      return lastPage.length < ITEMS_PER_PAGE ? undefined : lastPageParam + 1
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      // If the first page is page 0, there are no previous pages to fetch,
      // otherwise, return the previous page number
      return firstPageParam === 0 ? undefined : firstPageParam - 1
    },
    refetchOnWindowFocus: false, // Don't refetch the data when the window regains focus
    staleTime: Infinity, // Never refetch the data
  })
}
