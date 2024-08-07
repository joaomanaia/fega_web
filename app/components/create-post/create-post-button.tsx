"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { type Dictionary } from "@/get-dictionary"
import React from "react"
import { useFormStatus } from "react-dom"

interface CreatePostButtonProps extends ButtonProps {
  dictionary: Dictionary["post"]["create"]["submitButton"]
}

export const CreatePostButton = React.forwardRef<HTMLButtonElement, CreatePostButtonProps>(
  ({ dictionary, ...props }, ref) => {
    const { pending } = useFormStatus()

    return (
      <Button
        disabled={pending}
        variant="default"
        color="primary"
        type="submit"
        className="w-full"
        ref={ref}
        {...props}
      >
        {pending ? dictionary.loading : dictionary.default}
      </Button>
    )
  }
)

CreatePostButton.displayName = "CreatePostButton"
