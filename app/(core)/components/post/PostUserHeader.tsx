import { defaultImgUrl } from "@/core/common"
import Image from "next/image"

interface PostUserHeaderProps {
  postTimestamp: string
  userName: string
  userProfileUrl?: string
}

const PostUserHeader: React.FC<PostUserHeaderProps> = ({
  postTimestamp,
  userName,
  userProfileUrl,
}) => {
  return (
    <div className="flex items-center">
      <div className="relative w-10 h-10">
        <Image
          src={userProfileUrl ?? defaultImgUrl}
          alt={`Photo of ${userName}`}
          fill
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col ml-2 space-y-1 justify-center">
        <p className="font-semibold my-0">{userName}</p>
        <p className="text-xs text-inherit">{postTimestamp}</p>
      </div>
    </div>
  )
}

export default PostUserHeader
