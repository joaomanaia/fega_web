"use client"

import MainContainer from "@/app/(core)/components/m3/MainContainer"
import CreatePostButton from "./CreatePostButton"
import { Input } from "../CreatePostInput"
import { twMerge } from "tailwind-merge"
import { createPost } from "@/core/actions/postActions"
import { useRef } from "react"

type CreatePostTypes = {
  className?: string
}

const CreatePost: React.FC<CreatePostTypes> = ({ className }) => {
  const ref = useRef<HTMLFormElement>(null)

  return (
    <MainContainer className={twMerge("h-fit", className)}>
      <form
        ref={ref}
        action={async (formData) => {
          const description = formData.get("description")?.toString()
          if (!description) return

          ref.current?.reset()

          await createPost(description)
        }}
      >
        <p className="text-2xl">Create post</p>
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
