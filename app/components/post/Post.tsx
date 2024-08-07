import type PostType from "@/types/PostType"
import type { PostVoteType } from "@/types/PostType"
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
  post: PostType
  postVotes: number
  authorName: string
  authorAvatarUrl: string
  localUserVotedType: PostVoteType | null
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
  postVotes,
  authorName,
  authorAvatarUrl,
  localUserVotedType,
  hideContainer,
  lang,
  dictionary,
  className,
  schemaHasPart,
}) => {
  const relativeCreatedAt = useMemo(() => getRelativeTime(post.created_at), [post.created_at])

  return (
    <article
      itemScope
      itemType="https://schema.org/SocialMediaPosting"
      itemID={post.id}
      itemProp={schemaHasPart ? "hasPart" : undefined}
      className={cn(
        "rounded-3xl flex flex-col gap-4",
        !hideContainer && "p-4 bg-surfaceVariant/30 dark:bg-surfaceVariant/[0.28]",
        className
      )}
    >
      <meta itemProp="datePublished" content={post.created_at} />
      <meta itemProp="text" content={post.description} />
      <PostUserHeader
        uid={post.uid}
        postId={post.id}
        localUid={localUid}
        relativeCreatedAt={relativeCreatedAt}
        userName={authorName}
        userProfileUrl={authorAvatarUrl}
        lang={lang}
      />
      <p itemProp="headline" className="text-lg">
        {post.description}
      </p>
      {post.images.length > 0 && <PostImages images={post.images} />}
      <div className="flex items-center space-x-4">
        <VotePostAction postId={post.id} voteCount={postVotes} votedType={localUserVotedType} />
        <SharePostButton postId={post.id} dictionary={dictionary.sharePostButton} />
      </div>
    </article>
  )
}

interface PostUserHeaderProps {
  postId: string
  localUid: string | null
  relativeCreatedAt: string
  uid: string
  userName: string
  userProfileUrl: string | null
  lang: Locale
}

const PostUserHeader: React.FC<PostUserHeaderProps> = ({
  postId,
  uid,
  localUid,
  relativeCreatedAt,
  userName,
  userProfileUrl,
  lang,
}) => {
  const profileUrl = `/${uid}`

  return (
    <div
      itemScope
      itemProp="author"
      itemType="https://schema.org/Person"
      className="flex items-center w-full group"
    >
      <meta itemProp="identifier" content={uid} />
      <UserHoverCard uid={uid}>
        <Link href={profileUrl} lang={lang}>
          <UserAvatar src={userProfileUrl} name={userName} />
        </Link>
      </UserHoverCard>
      <div className="flex flex-col ml-3 space-y-1 justify-center">
        <UserHoverCard uid={uid}>
          <Link
            itemProp="url"
            href={profileUrl}
            lang={lang}
            className="font-semibold my-0 next-link"
          >
            <span itemProp="name">{userName}</span>
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
