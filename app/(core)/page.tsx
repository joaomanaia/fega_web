import MainContainer from "@/components/m3/MainContainer"
import CreatePost from "./components/create_post/CreatePost"
import { PostWithUser } from "@/types/PostType"
import Post from "./components/post/Post"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/types/database.types"

const getPosts = async (): Promise<PostWithUser[]> => {
  const supabase = createServerComponentClient<Database>({ cookies })

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
      <MainContainer className="lg:w-full">
        <div className="flex flex-col space-y-8">
          {posts?.map((post) => (
            <Post key={post.id} post={post} user={post.author} />
          ))}
        </div>
      </MainContainer>
    </div>
  )
}
