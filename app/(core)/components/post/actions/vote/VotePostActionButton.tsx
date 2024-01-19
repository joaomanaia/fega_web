"use client"

import { PostVoteType } from "@/types/PostType"
import { cn } from "@/core/util/tailwindcssUtils"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { LucideIcon, ThumbsDown, ThumbsUp } from "lucide-react"

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
      variant={votedType === type ? "default" : "accent"}
      className={cn(
        "flex items-center space-x-2 rounded-none first:rounded-l-full last:rounded-r-full",
        className
      )}
    >
      <ButtonIcon type={type} votedType={votedType} Icon={type === "up" ? ThumbsUp : ThumbsDown} />
      {voteCount}
    </Button>
  )
}

interface ButtonIconProps {
  type: PostVoteType
  votedType?: PostVoteType
  Icon: LucideIcon
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ type, votedType, Icon }) => {
  return <Icon fill={votedType === type ? "currentColor" : "none"} size={20} className="mr-2" />
}
