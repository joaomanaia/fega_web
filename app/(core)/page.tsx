import MainContainer from "@/components/m3/MainContainer"
import CreatePost from "./components/create_post/CreatePost"
import PostType from "@/types/PostType"
import Post from "./components/post/Post"
import UserType from "@/types/UserType"

const getPosts = async (): Promise<PostType[]> => {
  const res = await fetch("https://64ae79e1c85640541d4d24a9.mockapi.io/posts", {
    method: "GET",
    cache: "no-cache",
    next: {
      tags: ["posts"],
    }
  })

  return res.json()
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="relative flex flex-col lg:flex-row-reverse w-full">
      <CreatePost />
      <MainContainer className="lg:w-full">
        <div className="flex flex-col space-y-8">
          {posts.map((post) => (
            <Post key={post.id} post={post} user={{
              name: "John Doe",
              photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
              uid: "1",
              banned: false,
            }} />
          ))}
        </div>
      </MainContainer>
    </div>
  )
}
