import CreatePost from "./components/create_post/CreatePost"
import MainContainer from "./components/m3/MainContainer"
import PostsContent from "./PostsContent"

export default async function HomePage() {
  return (
    <main className="flex flex-col lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <CreatePost />
      <MainContainer className="flex flex-col space-y-8 lg:w-full lg:overflow-auto">
        <PostsContent />
      </MainContainer>
    </main>
  )
}
