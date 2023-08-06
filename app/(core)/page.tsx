import CreatePost from "./components/create_post/CreatePost"
import { PostWithUser } from "@/types/PostType"
import Post from "./components/post/Post"
import { Database } from "@/types/database.types"
import MainContainer from "./components/m3/MainContainer"
import { createServerComponentClient } from "@/supabase"

const getPosts = async (): Promise<PostWithUser[]> => {
  const supabase = createServerComponentClient()

  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:users(*)")
    .order("created_at", { ascending: false })

  return posts as PostWithUser[]
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="relative flex flex-col lg:flex-row-reverse w-full">
      <CreatePost />
      <MainContainer className="flex flex-col space-y-8 lg:w-full">
        {posts?.map((post) => (
          <Post key={post.id} post={post} user={post.author} />
        ))}
      </MainContainer>
    </div>
  )
}
