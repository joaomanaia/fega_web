"use client"

import { Button } from "@/components/ui/button"
import { useShare } from "@/hooks/use-share"
import { Share } from "lucide-react"
import { useTranslations } from "next-intl"

interface SharePostButtonProps {
  postId: string
}

export const SharePostButton: React.FC<SharePostButtonProps> = ({ postId }) => {
  const { onShare } = useShare()
  const t = useTranslations("Share.post")

  return (
    <Button
      variant="surfaceVariant"
      onClick={() =>
        onShare({
          dialogTitle: t("title"),
          dialogDescription: t("description"),
          url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${postId}`,
          text: t("quote"),
        })
      }
    >
      <Share size={20} className="mr-2" />
      {t("shareButton")}
    </Button>
  )
}
