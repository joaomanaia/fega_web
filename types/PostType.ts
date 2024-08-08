import type { Enums, Tables } from "@/types/database.types"

type PostType = Tables<"posts">
export type PostViewType = Tables<"posts_view">

export type PostVoteType = Enums<"post_vote_type">

export default PostType
