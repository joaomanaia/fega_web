import { getLocalUserUid } from "@/utils/user-utils"
import CreatePost from "./components/create_post/CreatePost"
import { MainContainer } from "./components/m3/main-container"
import PostsContent from "./PostsContent"

export default async function HomePage() {
  const localUid = await getLocalUserUid()

  return (
    <main className="flex flex-col md:pb-3 md:gap-4 lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <CreatePost />
      <MainContainer className="flex flex-col rounded-none md:rounded-[30px] space-y-4 md:space-y-6 lg:w-full lg:overflow-auto">
        <PostsContent localUid={localUid} />
      </MainContainer>
    </main>
  )
}
