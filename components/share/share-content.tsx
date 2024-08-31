"use client"

import { CopyToClipboard } from "@/components/share/copy-to-clipboard"
import { SocialShareRow } from "@/components/share/social-share-button"
import type { Dictionary } from "@/get-dictionary"

interface ShareContentProps {
  url: string
  text: string
  hideSocials?: boolean
  hideCopyUrl?: boolean
  dictionary: Dictionary
}

export const ShareContent: React.FC<ShareContentProps> = ({
  url,
  text,
  hideSocials,
  hideCopyUrl,
  dictionary,
}) => {
  return (
    <>
      {!hideSocials && <SocialShareRow className="overflow-x-auto" url={url} text={text} />}

      {!hideCopyUrl && <CopyToClipboard text={url} dictionary={dictionary.share} />}
    </>
  )
}
