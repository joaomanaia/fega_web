"use client"

import { PostVoteType } from "@/types/PostType"
import { VotePostActionButton } from "./VotePostActionButton"
import { handleVote } from "@/app/actions/post/voteActions"
import { useState } from "react"

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
  const handleVoteWithPostId = handleVote.bind(null, postId)

  const [optimisticVote, setOptimisticVote] = useState<OptimisticVote>({
    voteCount: voteCount ?? 0,
    votedType: votedType,
  })

  return (
    <form
      action={async (formData: FormData) => {
        const newVoteRes = await handleVoteWithPostId(formData)
        const newVoteType = newVoteRes?.vote_type

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
      <div className="flex">
        <VotePostActionButton
          itemScope
          itemProp="interactionStatistic"
          itemType="https://schema.org/InteractionCounter"
          voteType="up"
          votedType={optimisticVote.votedType}
          voteCount={optimisticVote.voteCount}
        />
        <VotePostActionButton voteType="down" votedType={optimisticVote.votedType} />
      </div>
    </form>
  )
}
