import type { Database, Enums, Tables } from "@/types/database.types"
import type UserType from "@/types/UserType"

type PostType = Tables<"posts">

export default PostType

export type PostWithUser = PostType & { author: UserType }

export type PostsWithData = Database["public"]["Functions"]["get_posts_with_data"]["Returns"]

export type PostWithData = PostsWithData[number]

export type PostVoteType = Enums<"post_vote_type">
