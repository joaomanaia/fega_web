import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded"
import ThumbDownRounded from "@mui/icons-material/ThumbDownRounded"
import { Button, ButtonGroup } from "@mui/material"
import { PostVoteType } from "@/types/PostType"

interface VotePostActionProps {
  voteCount?: number
  votedType?: PostVoteType
}

export const VotePostAction: React.FC<VotePostActionProps> = ({ voteCount, votedType }) => {
  return (
    <ButtonGroup>
      <Button
        variant={votedType === "up" ? "filled" : "surfaceVariant"}
        className="flex items-center space-x-2"
        startIcon={<ThumbUpRoundedIcon />}
      >
        {voteCount}
      </Button>
      <Button 
        variant={votedType === "down" ? "filled" : "surfaceVariant"}
        className="flex items-center space-x-2">
        <ThumbDownRounded />
      </Button>
    </ButtonGroup>
  )
}
