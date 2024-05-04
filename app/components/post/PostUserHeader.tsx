import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { defaultImgUrl } from "@/core/common"
import Link from "next/link"
import { PostMoreActions } from "./post-more-actions"

interface PostUserHeaderProps {
  postId: string
  uid: string
  localUid: string | null
  postTimestamp: string
  userName: string
  userProfileUrl: string | null
}

const PostUserHeader: React.FC<PostUserHeaderProps> = ({
  postId,
  uid,
  localUid,
  postTimestamp,
  userName,
  userProfileUrl,
}) => {
  const profileUrl = `/${uid}`

  return (
    <div className="flex items-center w-full group">
      <Link href={profileUrl}>
        <Avatar>
          <AvatarImage src={userProfileUrl ?? defaultImgUrl} />
          <AvatarFallback>{userName.at(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-col ml-3 space-y-1 justify-center">
        <Link href={profileUrl} className="font-semibold my-0 next-link">
          {userName}
        </Link>
        <p className="text-xs text-inherit">{postTimestamp}</p>
      </div>
      {uid === localUid && <PostMoreActions postId={postId} />}
    </div>
  )
}

export default PostUserHeader
