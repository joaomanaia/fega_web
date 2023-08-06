import MainContainer from "@/app/(core)/components/m3/MainContainer"
import CreatePostButton from "./CreatePostButton"
import CreatePostInput from "./CreatePostInput"
import { twMerge } from "tailwind-merge"
import { revalidatePath, revalidateTag } from "next/cache"
import { createServerActionClient } from "@/supabase"

type CreatePostTypes = {
  className?: string
}

const CreatePost: React.FC<CreatePostTypes> = ({ className }) => {
  const addPostToDB = async (formData: FormData) => {
    "use server"

    const description = formData.get("description")?.toString()
    if (!description) return

    const supabase = createServerActionClient()

    await supabase.from("posts").insert({ description })

    revalidateTag("posts")
    revalidatePath("/")
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
