"use client"

import { PostVoteType } from "@/types/PostType"
import { Button } from "@mui/material"
import ThumbUpRounded from "@mui/icons-material/ThumbUpRounded"
import ThumbDownRounded from "@mui/icons-material/ThumbDownRounded"
import { cn } from "@/core/util/tailwindcssUtils"
import { experimental_useFormStatus as useFormStatus } from "react-dom"

interface VotePostActionButtonProps {
  type: PostVoteType
  votedType?: PostVoteType
  voteCount?: number
  className?: string
}

export const VotePostActionButton: React.FC<VotePostActionButtonProps> = ({
  type,
  votedType,
  voteCount,
  className,
}) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      name="vote_button"
      value={type}
      disabled={pending}
      variant={votedType === type ? "filled" : "surfaceVariant"}
      className={cn(
        "flex items-center space-x-2 rounded-none first:rounded-l-full last:rounded-r-full",
        className
      )}
      startIcon={type === "up" ? <ThumbUpRounded /> : <ThumbDownRounded />}
    >
      {voteCount}
    </Button>
  )
}
