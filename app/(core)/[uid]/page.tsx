import { getLocalUserUid } from "@/utils/user-utils"
import CreatePost from "../components/create_post/CreatePost"
import MainContainer from "../components/m3/MainContainer"
import { UserProfileContent } from "./components/UserProfileContent"
import PostsContent from "../PostsContent"

export default async function UserPage({ params }: { params: { uid: string } }) {
  const localUserUid = await getLocalUserUid()
  const isLocalUser = localUserUid === params.uid

  return (
    <main className="flex flex-col lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <div className="flex flex-col">
        <MainContainer className="h-fit lg:w-96 flex flex-col space-y-4">
          <UserProfileContent uid={params.uid} isLocalUser={isLocalUser} />
        </MainContainer>
        {isLocalUser && <CreatePost />}
      </div>
      <MainContainer className="flex flex-col space-y-8 lg:w-full lg:overflow-auto">
        <PostsContent uid={params.uid} />
      </MainContainer>
    </main>
  )
}
