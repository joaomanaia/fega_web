import MainContainer from "@/components/m3/MainContainer"
import CreatePostButton from "./CreatePostButton"
import CreatePostInput from "./CreatePostInput"
import PostType from "@/types/PostType"
import { randomUUID } from "crypto"
import { twMerge } from "tailwind-merge"
import { revalidateTag } from "next/cache"

type CreatePostTypes = {
  className?: string
}

const CreatePost: React.FC<CreatePostTypes> = ({ className }) => {
  const addPostToDB = async (e: FormData) => {
    "use server"

    const description = e.get("description")?.toString()

    if (!description) return

    const newPost: PostType = {
      id: randomUUID(),
      uid: "",
      created_at: new Date().toString(),
      description: description,
      images: [],
    }

    await fetch("https://64ae79e1c85640541d4d24a9.mockapi.io/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-Type": "application/json",
      },
    })

    revalidateTag("posts")
  }

  return (
    <MainContainer className={twMerge("h-fit", className)}>
      <p className="text-2xl">Create post</p>

      <form action={addPostToDB}>
        <CreatePostInput />
        <CreatePostButton />
      </form>
    </MainContainer>
  )
}

export default CreatePost
