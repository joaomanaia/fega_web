"use client"

import { useQueryClient } from "@tanstack/react-query"
import { ButtonGroup, ButtonGroupSeparator } from "@workspace/ui/components/button-group"
import { useOptimisticAction } from "next-safe-action/hooks"
import { handleVote } from "@/app/actions/post/voteActions"
import { computeNextVote, updatePostVoteInCache } from "@/features/post/post-utils"
import type { PostVoteType } from "@/types/PostType"
import { VotePostActionButton } from "./VotePostActionButton"

interface VotePostActionProps {
  postId: string
  voteCount?: number
  votedType: PostVoteType | null
}

export const VotePostAction: React.FC<VotePostActionProps> = ({
  postId,
  voteCount = 0,
  votedType,
}) => {
  const queryClient = useQueryClient()

  const bindHandleVote = handleVote.bind(null, postId)
  const { execute, optimisticState, isExecuting } = useOptimisticAction(bindHandleVote, {
    currentState: { voteCount, votedType },
    updateFn: (current, input) => computeNextVote(current, input.voteType),
    onSuccess: ({ input }) => updatePostVoteInCache(queryClient, postId, input.voteType),
  })

  return (
    <ButtonGroup>
      <VotePostActionButton
        itemScope
        itemProp="interactionStatistic"
        itemType="https://schema.org/InteractionCounter"
        voteType="up"
        votedType={optimisticState.votedType}
        voteCount={optimisticState.voteCount}
        disabled={isExecuting}
        onClick={() => execute({ voteType: "up" })}
      />
      <ButtonGroupSeparator className="bg-surface-variant/30 dark:bg-surface-variant/[0.28]" />
      <VotePostActionButton
        voteType="down"
        votedType={optimisticState.votedType}
        disabled={isExecuting}
        onClick={() => execute({ voteType: "down" })}
      />
    </ButtonGroup>
  )
}
