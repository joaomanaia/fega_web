"use client"

import { Button } from "@/components/ui/button"
import { type Dictionary } from "@/get-dictionary"
import { useShare } from "@/hooks/use-share"
import { Share } from "lucide-react"

interface SharePostButtonProps {
  postId: string
  dictionary: Dictionary["share"]
}

export const SharePostButton: React.FC<SharePostButtonProps> = ({ postId, dictionary }) => {
  const { onShare } = useShare()

  return (
    <Button
      variant="surfaceVariant"
      onClick={() =>
        onShare({
          dialogTitle: dictionary.sharePostTitle,
          dialogDescription: dictionary.sharePostDescription,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${postId}`,
          text: dictionary.sharePostQuote,
          shareNativeIfAvailable: true,
        })
      }
    >
      <Share size={20} className="mr-2" />
      {dictionary.share}
    </Button>
  )
}
