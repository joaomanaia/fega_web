"use client"

import { ShareRounded } from "@mui/icons-material"
import { Button } from "@mui/material"

interface SharePostActionProps {
  postId: string
}

export const SharePostAction: React.FC<SharePostActionProps> = ({ postId }) => {
  const copyUrl = () => {
    const postUrl = `${location.origin}/post/${postId}`
    navigator.clipboard.writeText(postUrl)

    alert("Post URL copied to clipboard!")
  }

  return (
    <Button variant="surfaceVariant" startIcon={<ShareRounded />} onClick={copyUrl}>
      Share
    </Button>
  )
}
