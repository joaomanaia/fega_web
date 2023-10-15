import { defaultImgUrl } from "@/core/common"
import Image from "next/image"
import Link from "next/link"

interface PostUserHeaderProps {
  uid: string
  postTimestamp: string
  userName: string
  userProfileUrl: string | null
}

const PostUserHeader: React.FC<PostUserHeaderProps> = ({
  uid,
  postTimestamp,
  userName,
  userProfileUrl,
}) => {
  const profileUrl = `/${uid}`

  return (
    <div className="flex items-center">
      <Link href={profileUrl} className="relative w-10 h-10">
        <Image
          src={userProfileUrl ?? defaultImgUrl}
          alt={`Photo of ${userName}`}
          fill
          className="rounded-full"
        />
      </Link>
      <div className="flex flex-col ml-2 space-y-1 justify-center">
        <Link href={profileUrl} className="font-semibold my-0 next-link">
          {userName}
        </Link>
        <p className="text-xs text-inherit">{postTimestamp}</p>
      </div>
    </div>
  )
}

export default PostUserHeader
