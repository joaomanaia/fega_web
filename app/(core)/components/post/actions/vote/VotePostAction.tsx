import { PostVoteType } from "@/types/PostType"
import { VotePostActionButton } from "./VotePostActionButton"
import { handleVote } from "@/app/actions/post/voteActions"

interface VotePostActionProps {
  postId: string
  voteCount?: number
  votedType?: PostVoteType
}

export const VotePostAction: React.FC<VotePostActionProps> = ({ postId, voteCount, votedType }) => {
  const handleVoteWithPostId = handleVote.bind(null, postId)

  return (
    <form action={handleVoteWithPostId}>
      <div className="flex">
        <VotePostActionButton type="up" votedType={votedType} voteCount={voteCount} />
        <VotePostActionButton type="down" votedType={votedType} />
      </div>
    </form>
  )
}
