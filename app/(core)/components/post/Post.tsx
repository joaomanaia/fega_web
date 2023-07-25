import PostType from "@/types/PostType"
import UserType from "@/types/UserType"
import PostContainer from "./PostContainer"
import PostUserHeader from "./PostUserHeader"
import { defaultImgUrl } from "@/core/common"
import PostImages from "./PostImages"
import { useMemo } from "react"
import moment from "moment"

interface PostProps {
  post: PostType
  user: UserType
  hideContainer?: boolean
}

function getRelativeTime(createdAt: string) {
  return moment(createdAt).fromNow()
}

const Post: React.FC<PostProps> = ({ post, user, hideContainer }) => {
  const createdAt = useMemo(() => getRelativeTime(post.created_at), [post.created_at])

  return (
    <PostContainer hideContainer={hideContainer}>
      <div className="flex flex-col space-y-4">
        <PostUserHeader
          postTimestamp={createdAt}
          userName={user.full_name}
          userProfileUrl={user.avatar_url}
        />
        <p className="text-lg">{post.description}</p>
        <PostImages images={post.images} />
      </div>
    </PostContainer>
  )
}

export default Post
