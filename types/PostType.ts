import UserType from "./UserType"
import { Database } from "./database.types"

type PostType = Database["public"]["Tables"]["posts"]["Row"]

export default PostType

export type PostWithUser = PostType & { author: UserType }

export type PostsWithData = Database["public"]["Functions"]["get_post_with_data"]["Returns"]

export type PostWithData = PostsWithData[0]

export type PostVoteType = Database["public"]["Enums"]["post_vote_type"]
