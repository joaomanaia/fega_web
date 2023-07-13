import PostType from "@/types/PostType"
import UserType from "@/types/UserType"
import PostContainer from "./PostContainer"
import PostUserHeader from "./PostUserHeader"
import { defaultImgUrl } from "@/core/common"
import PostImages from "./PostImages"

interface PostProps {
  post: PostType
  user: UserType
  hideContainer?: boolean
}

const DAY_MILLISECONDS = 1000 * 60 * 60 * 24

function getRelativeTime(timestamp: number) {
  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  })
  const daysDifference = Math.round((timestamp - new Date().getTime()) / DAY_MILLISECONDS)

  return rtf.format(daysDifference, "day")
}

const Post: React.FC<PostProps> = ({ post, user, hideContainer }) => {
  // const time = getRelativeTime(Date.parse(post.timestamp))

  return (
    <PostContainer hideContainer={hideContainer}>
      <div className="flex flex-col space-y-4">
        <PostUserHeader postTimestamp={post.timestamp} userName={user.name} userProfileUrl={defaultImgUrl} />
        <p className="text-lg">{post.description}</p>
        <PostImages
          images={[
            "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/cameras%2Ffigueiradafoz-panoramica.jpeg?alt=media&token=a4cae7d0-111e-4e33-a70f-329091a9fb38",
            "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/cameras%2Ffigueiradafoz-panoramica.jpeg?alt=media&token=a4cae7d0-111e-4e33-a70f-329091a9fb38",
          ]}
        />
      </div>
    </PostContainer>
  )
}

export default Post
