"use client"

import { LucideIcon, ThumbsDown, ThumbsUp } from "lucide-react"
import { useFormStatus } from "react-dom"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PostVoteType } from "@/types/PostType"

interface VotePostActionButtonProps extends ButtonProps {
  voteType: PostVoteType
  votedType: PostVoteType | null
  voteCount?: number
}

export function VotePostActionButton({
  voteType,
  votedType,
  voteCount,
  className,
  ...props
}: VotePostActionButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      name="vote_button"
      value={voteType}
      disabled={pending}
      variant={votedType === voteType ? "default" : "surfaceVariant"}
      className={cn(
        "flex items-center rounded-none first:rounded-l-full last:rounded-r-full last:pr-4",
        className
      )}
      {...props}
    >
      {voteType === "up" && (
        <meta itemProp="interactionType" content="https://schema.org/LikeAction" />
      )}
      <ButtonIcon
        type={voteType}
        votedType={votedType}
        Icon={voteType === "up" ? ThumbsUp : ThumbsDown}
      />
      {voteCount !== undefined && <span itemProp="userInteractionCount">{voteCount}</span>}
    </Button>
  )
}

interface ButtonIconProps {
  type: PostVoteType
  votedType: PostVoteType | null
  Icon: LucideIcon
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ type, votedType, Icon }) => {
  return <Icon fill={votedType === type ? "currentColor" : "none"} />
}
