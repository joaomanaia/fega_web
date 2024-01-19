import { PostVoteType } from "@/types/PostType"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@/supabase"
import { redirect } from "next/navigation"
import { VotePostActionButton } from "./VotePostActionButton"
import { ButtonGroup } from "@mui/material"

interface VotePostActionProps {
  postId: string
  voteCount?: number
  votedType?: PostVoteType
}

export const VotePostAction: React.FC<VotePostActionProps> = ({ postId, voteCount, votedType }) => {
  const handleVote = async (formData: FormData) => {
    "use server"

    const buttonVoteType = formData.get("vote_button") as PostVoteType

    const supabase = createServerActionClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return redirect("/auth")
    }

    const { data: currentPostVote } = await supabase
      .from("post_votes")
      .select("vote_type")
      .eq("post_id", postId)
      .eq("uid", user.id)
      .single()

    // If the user has already voted, remove the vote
    const voteType = currentPostVote?.vote_type === buttonVoteType ? null : buttonVoteType

    const { data: vote, error: voteError } = await supabase
      .from("post_votes")
      .upsert({
        post_id: postId,
        vote_type: voteType,
      })
      .eq("post_id", postId)
      .eq("uid", user.id)
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
        <VotePostActionButton type="up" votedType={votedType} voteCount={voteCount} />
        <VotePostActionButton type="down" votedType={votedType} />
      </ButtonGroup>
    </form>
  )
}
