import PostType, { PostVoteType } from "@/types/PostType"
import PostContainer from "./PostContainer"
import PostUserHeader from "./PostUserHeader"
import PostImages from "./PostImages"
import { useMemo } from "react"
import moment from "moment"
import { VotePostAction } from "./actions/vote/VotePostAction"
import { SharePostButtont } from "./actions/share-post-button"

interface PostProps {
  post: PostType
  postVotes: number
  authorName: string
  authorAvatarUrl: string
  localUserVotedType: PostVoteType | null
  hideContainer?: boolean
}

function getRelativeTime(createdAt: string) {
  return moment(createdAt).fromNow()
}

const Post: React.FC<PostProps> = ({
  post,
  postVotes,
  authorName,
  authorAvatarUrl,
  localUserVotedType,
  hideContainer,
}) => {
  const createdAt = useMemo(() => getRelativeTime(post.created_at), [post.created_at])

  return (
    <PostContainer hideContainer={hideContainer} className="flex flex-col space-y-4 pb-4">
      <PostUserHeader
        uid={post.uid}
        postTimestamp={createdAt}
        userName={authorName}
        userProfileUrl={authorAvatarUrl}
      />
      <p className="text-lg">{post.description}</p>
      {post.images.length > 0 && <PostImages images={post.images} />}
      <div className="flex items-center space-x-4">
        <VotePostAction postId={post.id} voteCount={postVotes} votedType={localUserVotedType} />
        <SharePostButtont postId={post.id} />
      </div>
    </PostContainer>
  )
}

export default Post
