import type { InfiniteData, QueryClient } from "@tanstack/react-query"
import type { PostViewType, PostVoteType } from "@/types/PostType"

export function updatePostVoteInCache(
  queryClient: QueryClient,
  postId: string,
  clickedVoteType: PostVoteType,
) {
  queryClient.setQueriesData<InfiniteData<PostViewType[]>>({ queryKey: ["posts"] }, (oldData) => {
    if (!oldData) return oldData

    return {
      ...oldData,
      pages: oldData.pages.map((page) =>
        page.map((post) => {
          if (post.id !== postId) return post

          const { voteCount, votedType } = computeNextVote(
            { voteCount: post.votes ?? 0, votedType: post.user_vote_type },
            clickedVoteType,
          )

          return {
            ...post,
            votes: voteCount,
            user_vote_type: votedType,
          }
        }),
      ),
    }
  })
}

export function computeNextVote(
  current: { voteCount: number; votedType: PostVoteType | null },
  clickedType: PostVoteType,
) {
  const nextType: PostVoteType | null = current.votedType === clickedType ? null : clickedType
  const valueOf = (type: PostVoteType | null) => (type === "up" ? 1 : type === "down" ? -1 : 0)
  const delta = valueOf(nextType) - valueOf(current.votedType)

  return {
    voteCount: current.voteCount + delta,
    votedType: nextType,
  }
}
