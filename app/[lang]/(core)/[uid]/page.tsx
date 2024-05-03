import { getLocalUserUid } from "@/utils/user-utils"
import CreatePost from "@/app/components/create_post/CreatePost"
import { UserProfileContent } from "./components/UserProfileContent"
import PostsContent from "../PostsContent"
import { MainContainer } from "@/app/components/m3/main-container"
import { cn } from "@/lib/utils"

export default async function UserPage({ params }: { params: { uid: string } }) {
  const localUserUid = await getLocalUserUid()
  const isLocalUser = localUserUid === params.uid

  return (
    <main className="flex flex-col gap-4 md:pb-3 lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <div className="flex flex-col md:gap-4">
        <MainContainer
          className={cn(
            "h-fit xl:w-96 flex flex-col space-y-4",
            isLocalUser && "rounded-b-none md:rounded-[30px]"
          )}
        >
          <UserProfileContent uid={params.uid} isLocalUser={isLocalUser} />
        </MainContainer>
        {isLocalUser && <CreatePost className="rounded-none rounded-b-[30px]" />}
      </div>
      <MainContainer className="flex flex-col space-y-4 md:space-y-6 h-full lg:w-full rounded-b-none md:rounded-[30px] lg:overflow-auto">
        <PostsContent uid={params.uid} localUid={localUserUid} />
      </MainContainer>
    </main>
  )
}
