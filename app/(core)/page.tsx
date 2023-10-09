import CreatePost from "./components/create_post/CreatePost"
import { PostWithUser } from "@/types/PostType"
import Post from "./components/post/Post"
import MainContainer from "./components/m3/MainContainer"
import { createServerComponentClient } from "@/supabase"

const getPosts = async (): Promise<PostWithUser[]> => {
  const supabase = createServerComponentClient()

  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:users!posts_uid_fkey(*)")
    .order("created_at", { ascending: false })

  return posts as PostWithUser[]
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <main className="flex flex-col lg:flex-row-reverse w-full h-full overflow-auto lg:overflow-hidden">
      <CreatePost />
      <MainContainer className="flex flex-col space-y-8 lg:w-full lg:overflow-auto">
        {posts?.map((post) => (
          <Post key={post.id} post={post} user={post.author} />
        ))}
      </MainContainer>
    </main>
  )
}
