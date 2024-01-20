"use client"

import { CreatePostButton } from "./CreatePostButton"
import { Input } from "../CreatePostInput"
import { createPost } from "@/core/actions/postActions"
import { useRef } from "react"
import { MainContainer } from "../m3/main-container"
import { cn } from "@/lib/utils"

type CreatePostTypes = {
  className?: string
}

const CreatePost: React.FC<CreatePostTypes> = ({ className }) => {
  const ref = useRef<HTMLFormElement>(null)

  return (
    <MainContainer className={cn("h-fit rounded-b-none md:rounded-[30px]", className)}>
      <form
        className="flex flex-col gap-4 lg:min-w-52 xl:min-w-64"
        ref={ref}
        action={async (formData) => {
          const description = formData.get("description")?.toString()
          if (!description) return

          ref.current?.reset()

          await createPost(description)
        }}
      >
        <p className="text-2xl mt-4 mb-0">Create post</p>
        <Input
           placeholder="What's on your mind?"
           name="description"
           type="text"
           required />
        <CreatePostButton />
      </form>
    </MainContainer>
  )
}

export default CreatePost
