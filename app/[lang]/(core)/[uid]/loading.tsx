import { MainContainer } from "@/app/components/m3/main-container"
import { cn } from "@/lib/utils"
import { UserProfileSkeleton } from "../[uid]/components/UserProfileContent"
import { PostSkeleton } from "@/app/components/post/Post"

export default function Loading() {
  return (
    <main className="flex flex-col gap-4 md:pb-3 lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <div className="flex flex-col md:gap-4">
        <MainContainer className={cn("h-fit xl:w-96 flex flex-col space-y-4")}>
          <UserProfileSkeleton />
        </MainContainer>
      </div>
      <MainContainer className="flex flex-col space-y-4 md:space-y-6 h-full lg:w-full rounded-b-none md:rounded-[30px] lg:overflow-auto">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </MainContainer>
    </main>
  )
}
