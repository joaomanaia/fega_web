import UserType from "./UserType"

type PostType = {
  id: string
  uid: string
  created_at: string
  description: string
  images: string[]
}

export default PostType

export type PostWithUser = PostType & { author: UserType }