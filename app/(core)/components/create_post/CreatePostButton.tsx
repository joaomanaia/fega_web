"use client"

import { Button } from "@mui/material"
import { useFormStatus } from "react-dom"

const CreatePostButton: React.FC = () => {
  const { pending } = useFormStatus()

  return (
    <Button
      disabled={pending}
      variant="filled"
      fullWidth
      sx={{ mt: 3 }}
      color="primary"
      type="submit"
    >
      {pending ? "Creating..." : "Create"}
    </Button>
  )
}

export default CreatePostButton
