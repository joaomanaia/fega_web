import type { PostViewType } from "@/types/PostType"
import PostImages from "./PostImages"
import { useMemo } from "react"
import moment from "moment"
import { VotePostAction } from "./actions/vote/VotePostAction"
import { SharePostButton } from "./actions/share-post-button"
import { type Dictionary } from "@/get-dictionary"
import { cn } from "@/lib/utils"
import { Link } from "@/components/link"
import { PostMoreActions } from "./post-more-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { type Locale } from "@/i18n-config"
import { UserHoverCard } from "@/app/components/user/user-hover-card"
import { UserAvatar } from "@/app/components/user/user-avatar"

/**
 * @param schemaHasPart - if true, the post is part of a parent schema
 */
interface PostProps {
  localUid: string | null
  post: PostViewType
  hideContainer?: boolean
  lang: Locale
  dictionary: Dictionary
  className?: string
  schemaHasPart?: boolean
}

function getRelativeTime(createdAt: string) {
  return moment(createdAt).fromNow()
}

const Post: React.FC<PostProps> = ({
  localUid,
  post,
  hideContainer,
  lang,
  dictionary,
  className,
  schemaHasPart,
}) => {
  const relativeCreatedAt = useMemo(() => getRelativeTime(post.created_at!), [post.created_at])

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
        relativeCreatedAt={relativeCreatedAt}
        username={post.author_username!}
        userFullname={post.author_full_name!}
        userProfileUrl={post.author_avatar_url!}
        lang={lang}
      />
      <h3 itemProp="headline" className="text-lg">
        {post.description}
      </h3>
      {post.images && post.images.length > 0 && <PostImages images={post.images} />}
      <div className="flex flex-wrap items-center gap-4">
        <VotePostAction postId={post.id!} voteCount={post.votes!} votedType={post.user_vote_type} />
        <SharePostButton postId={post.id!} dictionary={dictionary.share} />
      </div>
    </article>
  )
}

interface PostUserHeaderProps {
  postId: string
  localUid: string | null
  relativeCreatedAt: string
  uid: string
  username: string
  userFullname: string
  userProfileUrl: string | null
  lang: Locale
}

const PostUserHeader: React.FC<PostUserHeaderProps> = ({
  postId,
  uid,
  localUid,
  relativeCreatedAt,
  username,
  userFullname,
  userProfileUrl,
  lang,
}) => {
  return (
    <div
      itemScope
      itemProp="author"
      itemType="https://schema.org/Person"
      className="flex items-center w-full group"
    >
      <meta itemProp="identifier" content={uid} />
      <meta itemProp="alternateName" content={`@${username}`} />
      <UserHoverCard uid={uid}>
        <Link href={`/${username}`} lang={lang}>
          <UserAvatar src={userProfileUrl} name={userFullname} />
        </Link>
      </UserHoverCard>
      <div className="flex flex-col ml-3 space-y-1 justify-center">
        <UserHoverCard uid={uid}>
          <Link
            itemProp="url"
            href={`/${username}`}
            lang={lang}
            className="font-semibold my-0 next-link"
          >
            <span itemProp="name">{userFullname}</span>
          </Link>
        </UserHoverCard>
        <p className="text-xs text-inherit">{relativeCreatedAt}</p>
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
  // Random height between 30 and 100
  const randomHeight = Math.floor(Math.random() * (100 - 30 + 1) + 30)

  return (
    <div
      className={cn(
        "rounded-3xl flex flex-col gap-4",
        !hideContainer && "p-4 bg-surfaceVariant/30 dark:bg-surfaceVariant/[0.28]",
        className
      )}
    >
      <PostHeaderSkeleton />
      <Skeleton
        className="w-full"
        style={{
          height: `${randomHeight}px`,
        }}
      />
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
