"use client"

import { Button } from "@mui/material"

const CreatePostButton: React.FC = () => {
  return (
    <Button variant="filled" fullWidth sx={{ mt: 3 }} color="primary" type="submit">
      Publish
    </Button>
  )
}

export default CreatePostButton
