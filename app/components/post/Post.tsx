import type { PostViewType } from "@/types/PostType"
import PostImages from "./PostImages"
import { VotePostAction } from "./actions/vote/VotePostAction"
import { SharePostButton } from "./actions/share-post-button"
import { cn } from "@/lib/utils"
import { PostMoreActions } from "./post-more-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/app/components/user/user-avatar"
import Linkify from "@/components/linkify"
import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import { useFormatter, useNow } from "next-intl"

/**
 * @param schemaHasPart - if true, the post is part of a parent schema
 */
interface PostProps {
  localUid: string | null
  post: PostViewType
  hideContainer?: boolean
  className?: string
  schemaHasPart?: boolean
}

const Post: React.FC<PostProps> = ({ localUid, post, hideContainer, className, schemaHasPart }) => {
  return (
    <article
      itemScope
      itemType="https://schema.org/SocialMediaPosting"
      itemProp={schemaHasPart ? "hasPart" : undefined}
      className={cn(
        "rounded-3xl flex flex-col gap-4",
        !hideContainer && "p-4 bg-surfaceVariant/30 dark:bg-surfaceVariant/[0.28]",
        className
      )}
    >
      <meta itemProp="datePublished" content={post.created_at!} />
      <meta itemProp="text" content={post.description!} />
      <meta itemProp="id" content={post.id!} />
      <meta itemProp="url" content={`/post/${post.id}`} />

      <PostUserHeader
        uid={post.uid!}
        postId={post.id!}
        localUid={localUid}
        createdAt={new Date(post.created_at!)}
        username={post.author_username!}
        userFullname={post.author_full_name!}
        userProfileUrl={post.author_avatar_url!}
      />
      <Linkify>
        <h3 itemProp="headline" className="text-lg">
          {post.description}
        </h3>
      </Linkify>
      {post.images && post.images.length > 0 && <PostImages images={post.images} />}
      <div className="flex flex-wrap items-center gap-4">
        <VotePostAction postId={post.id!} voteCount={post.votes!} votedType={post.user_vote_type} />
        <SharePostButton postId={post.id!} />
      </div>
    </article>
  )
}

interface PostUserHeaderProps {
  postId: string
  localUid: string | null
  createdAt: Date
  uid: string
  username: string
  userFullname: string
  userProfileUrl: string | null
}

const PostUserHeader: React.FC<PostUserHeaderProps> = ({
  postId,
  uid,
  localUid,
  createdAt,
  username,
  userFullname,
  userProfileUrl,
}) => {
  const now = useNow()
  const format = useFormatter()

  return (
    <div
      itemScope
      itemProp="author"
      itemType="https://schema.org/Person"
      className="flex items-center w-full group"
    >
      <meta itemProp="identifier" content={uid} />
      <meta itemProp="alternateName" content={`@${username}`} />
      <UserHoverCardWithLink uid={uid} username={username}>
        <UserAvatar src={userProfileUrl} name={userFullname} />
      </UserHoverCardWithLink>
      <div className="flex flex-col ml-3 space-y-1 justify-center">
        <UserHoverCardWithLink
          uid={uid}
          username={username}
          className="font-semibold my-0 next-link"
        >
          <span itemProp="name">{userFullname}</span>
        </UserHoverCardWithLink>
        <p className="text-xs text-inherit" suppressHydrationWarning>
          {format.relativeTime(createdAt, now)}
        </p>
      </div>
      {uid === localUid && <PostMoreActions postId={postId} />}
    </div>
  )
}

export default Post

interface PostSkeletonProps {
  hideContainer?: boolean
  className?: string
}

export const PostSkeleton: React.FC<PostSkeletonProps> = ({ hideContainer, className }) => {
  return (
    <div
      className={cn(
        "rounded-3xl flex flex-col gap-4",
        !hideContainer && "p-4 bg-surfaceVariant/30 dark:bg-surfaceVariant/[0.28]",
        className
      )}
    >
      <PostHeaderSkeleton />
      <Skeleton className="w-full h-20" />
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-6" />
        <Skeleton className="w-12 h-6" />
      </div>
    </div>
  )
}

const PostHeaderSkeleton: React.FC = () => (
  <div className="flex items-center w-full group">
    <Skeleton className="w-12 h-12 rounded-full" />
    <div className="flex flex-col ml-3 space-y-1 justify-center">
      <Skeleton className="w-36 h-6" />
      <Skeleton className="w-24 h-4" />
    </div>
  </div>
)
