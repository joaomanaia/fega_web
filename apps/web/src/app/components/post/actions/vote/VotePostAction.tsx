"use client"

import { useState } from "react"
import { ButtonGroup, ButtonGroupSeparator } from "@workspace/ui/components/button-group"
import { handleVote } from "@/app/actions/post/voteActions"
import { PostVoteType } from "@/types/PostType"
import { VotePostActionButton } from "./VotePostActionButton"

interface VotePostActionProps {
  postId: string
  voteCount?: number
  votedType: PostVoteType | null
}

type OptimisticVote = {
  voteCount: number
  votedType: NewVoteType
}

type NewVoteType = PostVoteType | null

export const VotePostAction: React.FC<VotePostActionProps> = ({ postId, voteCount, votedType }) => {
  const [optimisticVote, setOptimisticVote] = useState<OptimisticVote>({
    voteCount: voteCount ?? 0,
    votedType: votedType,
  })

  return (
    <form
      action={async (formData: FormData) => {
        const buttonVoteType = formData.get("vote_button") as PostVoteType
        if (!buttonVoteType) return

        const result = await handleVote({ postId, voteType: buttonVoteType })
        const newVoteType = result?.data?.vote_type ?? null

        setOptimisticVote((currentVote) => {
          let newVoteCount = currentVote.voteCount

          // Adjust the vote count based on the last vote type
          if (currentVote.votedType === "up") {
            newVoteCount -= 1 // If the last vote was an upvote, decrement the count
          } else if (currentVote.votedType === "down") {
            newVoteCount += 1 // If the last vote was a downvote, increment the count
          }

          // Adjust the vote count based on the new vote type
          if (newVoteType === "up") {
            newVoteCount += 1 // If the new vote is an upvote, increment the count
          } else if (newVoteType === "down") {
            newVoteCount -= 1 // If the new vote is a downvote, decrement the count
          }

          return { voteCount: newVoteCount, votedType: newVoteType }
        })
      }}
    >
      <ButtonGroup>
        <VotePostActionButton
          itemScope
          itemProp="interactionStatistic"
          itemType="https://schema.org/InteractionCounter"
          voteType="up"
          votedType={optimisticVote.votedType}
          voteCount={optimisticVote.voteCount}
        />
        <ButtonGroupSeparator className="bg-surface-variant/30 dark:bg-surface-variant/[0.28]" />
        <VotePostActionButton voteType="down" votedType={optimisticVote.votedType} />
      </ButtonGroup>
    </form>
  )
}
