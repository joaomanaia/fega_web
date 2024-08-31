import { createRouteHandlerClient } from "@/supabase"
import { NextResponse } from "next/server"

/**
 * Vote on a post
 *
 * @returns the vote object
 */
export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)

    const postId = params.postId
    const voteType = searchParams.get("voteType") as "up" | "down" | null

    if (!postId) {
      return new NextResponse("Post ID is required", { status: 400 })
    }

    const supabase = createRouteHandlerClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single()

    if (error) {
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    if (!post) {
      return new NextResponse("Post not found", { status: 404 })
    }

    const { data: vote, error: voteError } = await supabase
      .from("post_votes")
      .upsert({ post_id: postId, vote_type: voteType })
      .eq("post_id", postId)
      .eq("uid", user.id)
      .select()
      .single()

    if (voteError) {
      return new NextResponse("Error while voting", { status: 500 })
    }

    return NextResponse.json(vote)
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
