import { useFormatter, useNow } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import Linkify from "@/components/linkify"
import { cn } from "@/lib/utils"
import type { PostViewType } from "@/types/PostType"
import { SharePostButton } from "./actions/share-post-button"
import { VotePostAction } from "./actions/vote/VotePostAction"
import { PostMoreActions } from "./post-more-actions"
import PostImages from "./PostImages"

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
        "flex flex-col gap-4 rounded-3xl",
        !hideContainer && "bg-surface-variant/30 dark:bg-surface-variant/[0.28] p-4",
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
        <h3 itemProp="headline" className="overflow-x-hidden text-lg text-ellipsis">
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
      className="group flex w-full items-center"
    >
      <meta itemProp="identifier" content={uid} />
      <meta itemProp="alternateName" content={`@${username}`} />
      <UserHoverCardWithLink uid={uid} username={username}>
        <UserAvatar src={userProfileUrl} name={userFullname} />
      </UserHoverCardWithLink>
      <div className="ml-3 flex flex-col justify-center space-y-1">
        <UserHoverCardWithLink
          uid={uid}
          username={username}
          className="next-link my-0 font-semibold"
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
        "flex flex-col gap-4 rounded-3xl",
        !hideContainer && "bg-surface-variant/30 dark:bg-surface-variant/[0.28] p-4",
        className
      )}
    >
      <PostHeaderSkeleton />
      <Skeleton className="h-20 w-full" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  )
}

const PostHeaderSkeleton: React.FC = () => (
  <div className="group flex w-full items-center">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="ml-3 flex flex-col justify-center space-y-1">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
)
