"use client"

import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"

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
    <Button variant="accent" onClick={copyUrl}>
      <Share size={20} className="mr-2" />
      Share
    </Button>
  )
}
