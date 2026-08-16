import { cn } from "@workspace/ui/lib/utils"
import { MainContainer } from "@/app/components/m3/main-container"
import { PostSkeleton } from "@/app/components/post/Post"
import { UserProfileSkeleton } from "./components/user-profile-content"

export default function UserLoading() {
  return (
    <main className="flex h-full w-full flex-col gap-4 overflow-auto md:pb-3 lg:flex-row-reverse lg:overflow-hidden">
      <div className="flex flex-col md:gap-4">
        <MainContainer className={cn("flex h-fit flex-col space-y-4 xl:w-96")}>
          <UserProfileSkeleton />
        </MainContainer>
      </div>
      <MainContainer className="flex h-full flex-col space-y-4 rounded-b-none md:space-y-6 md:rounded-[30px] lg:w-full lg:overflow-auto">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </MainContainer>
    </main>
  )
}
