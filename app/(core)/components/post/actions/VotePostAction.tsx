import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded"
import ThumbDownRounded from "@mui/icons-material/ThumbDownRounded"
import { Button, ButtonGroup } from "@mui/material"
import { PostVoteType } from "@/types/PostType"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@/supabase"
import { redirect } from "next/navigation"

interface VotePostActionProps {
  postId: string
  voteCount?: number
  votedType?: PostVoteType
}

export const VotePostAction: React.FC<VotePostActionProps> = ({ postId, voteCount, votedType }) => {
  const handleVote = async (formData: FormData) => {
    "use server"

    let voteType: PostVoteType
    if (formData.get("up_vote_button") !== null) {
      voteType = "up"
    } else {
      voteType = "down"
    }

    const supabase = createServerActionClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return redirect("/auth")
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (!post) {
      throw new Error("Post not found")
    }

    const { data: vote, error: voteError } = await supabase
      .from("post_votes")
      .upsert({ post_id: postId, vote_type: voteType })
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (voteError) {
      throw new Error(voteError.message)
    }

    revalidatePath("/")
  }

  return (
    <form action={handleVote}>
      <ButtonGroup>
        <Button
          type="submit"
          name="up_vote_button"
          variant={votedType === "up" ? "filled" : "surfaceVariant"}
          className="flex items-center space-x-2"
          startIcon={<ThumbUpRoundedIcon />}
        >
          {voteCount}
        </Button>
        <Button
          type="submit"
          name="down_vote_button"
          variant={votedType === "down" ? "filled" : "surfaceVariant"}
          className="flex items-center space-x-2"
        >
          <ThumbDownRounded />
        </Button>
      </ButtonGroup>
    </form>
  )
}
