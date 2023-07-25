import MainContainer from "@/components/m3/MainContainer"
import PostType from "@/types/PostType"
import Post from "../../components/post/Post"

interface PostPageProps {
  params: { id: string }
}

const getPostById = async (id: string): Promise<PostType | null> => {
  const res = await fetch(`https://64ae79e1c85640541d4d24a9.mockapi.io/posts/${id}`, {
    method: "GET",
    cache: "no-cache",
    next: {
      tags: ["posts"],
    },
  })

  if (res.status !== 200) return null

  return res.json()
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id)

  if (!post) return <MainContainer>Post not found</MainContainer>

  return (
    <MainContainer>
      <Post
        hideContainer
        post={post}
        user={{
          full_name: "John Doe",
          avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
          id: "1"
        }}
      />
    </MainContainer>
  )
}
