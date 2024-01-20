"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export const CreatePostButton: React.FC = () => {
  const { pending } = useFormStatus()

  return (
    <Button
      disabled={pending}
      variant="default"
      color="primary"
      type="submit"
      className="w-full"
    >
      {pending ? "Creating..." : "Create"}
    </Button>
  )
}
