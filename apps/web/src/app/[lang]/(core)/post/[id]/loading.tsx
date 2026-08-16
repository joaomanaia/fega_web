import { MainContainer } from "@/app/components/m3/main-container"
import { PostSkeleton } from "@/app/components/post/Post"

export default function PostLoading() {
  return (
    <MainContainer className="mx-3 md:mx-0">
      <PostSkeleton hideContainer />
    </MainContainer>
  )
}
