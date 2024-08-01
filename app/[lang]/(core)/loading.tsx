import { CreatePostSkeleton } from "@/app/components/create_post/CreatePost"
import { MainContainer } from "@/app/components/m3/main-container"
import { PostSkeleton } from "@/app/components/post/Post"

export default function Loading() {
  return (
    <main className="flex flex-col md:pb-3 md:gap-4 lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <CreatePostSkeleton />
      <MainContainer className="flex flex-col rounded-none md:rounded-[30px] space-y-4 md:space-y-6 lg:w-full lg:overflow-auto">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </MainContainer>
    </main>
  )
}
