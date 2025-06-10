"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/src/i18n/navigation"
import { PostVoteType } from "@/types/PostType"
import { getLocale } from "next-intl/server"

export const handleVote = async (postId: string, formData: FormData) => {
  const buttonVoteType = formData.get("vote_button") as PostVoteType

  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/login", locale: await getLocale() })
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

  return vote
}
