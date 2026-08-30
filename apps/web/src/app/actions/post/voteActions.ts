"use server"

import { authActionClient, returnAppError } from "@/lib/safe-action"
import { votePostSchema } from "@/lib/schemas/post-schemas"
import type { PostVoteType } from "@/types/PostType"

export const handleVote = authActionClient
  .metadata({ actionName: "handleVote" })
  .inputSchema(votePostSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, uid } = ctx
    const { postId, voteType: buttonVoteType } = parsedInput

    const { data: currentPostVote } = await supabase
      .from("post_votes")
      .select("vote_type")
      .eq("post_id", postId)
      .eq("uid", uid)
      .single()

    // If the user has already voted with this vote type, remove the vote (toggle off)
    const newVoteType: PostVoteType | null =
      currentPostVote?.vote_type === buttonVoteType ? null : buttonVoteType

    const { data: vote, error: voteError } = await supabase
      .from("post_votes")
      .upsert({
        post_id: postId,
        vote_type: newVoteType,
        uid: uid,
      })
      .select()
      .single()

    if (voteError) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to process vote" })
    }

    return vote
  })
