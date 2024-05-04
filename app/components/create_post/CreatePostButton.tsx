"use client"

import { Button } from "@/components/ui/button"
import { type Dictionary } from "@/get-dictionary"
import { useFormStatus } from "react-dom"

interface CreatePostButtonProps {
  dictionary: Dictionary["createPost"]["button"]
}

export const CreatePostButton: React.FC<CreatePostButtonProps> = ({ dictionary }) => {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} variant="default" color="primary" type="submit" className="w-full">
      {pending ? dictionary.loading : dictionary.normal}
    </Button>
  )
}
