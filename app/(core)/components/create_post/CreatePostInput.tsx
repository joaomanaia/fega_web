"use client"

import { useTheme } from "@mui/material"

const CreatePostInput = () => {

  const { palette } = useTheme()

  return (
    <input
      className="w-full py-4 px-4 text-sm rounded-full border-none"
      style={{
        backgroundColor: palette.surfaceContainerHigh.main,
        color: palette.text.primary,
      }}
      placeholder="What's on your mind?"
      name="description"
      type="text"
      required
    />
  )
}

export default CreatePostInput
