import { Button } from "@mui/material"
import ScoreButton from "./ScoreButton"

interface PostActionsProps {
  postId: string
}

const PostActions: React.FC<PostActionsProps> = ({ postId }) => {
  return (
    <div className="flex items-center space-x-4">
      <ScoreButton postId={postId} />
      <Button variant="text">
        Share
      </Button>
    </div>
  )
}

export default PostActions
