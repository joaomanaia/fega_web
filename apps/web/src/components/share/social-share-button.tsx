import { SiFacebook, SiReddit, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons"
import { sendGTMEvent } from "@next/third-parties/google"
import { cn } from "@workspace/ui/lib/utils"
import { MailIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Hint } from "@/components/hint"
import { Link } from "@/i18n/navigation"

export const socialValues = ["facebook", "x", "whatsapp", "email", "reddit"] as const
export type Social = (typeof socialValues)[number]

export interface SocialShareRowProps {
  url: string
  text: string
  socials?: Social[]
  className?: string
  onShare?: (sharedOn: Social) => void
}

export const SocialShareRow: React.FC<SocialShareRowProps> = ({
  url,
  text,
  socials = socialValues,
  className,
  onShare,
}) => {
  return (
    <div className={cn("flex gap-2", className)}>
      {socials.map((social) => (
        <SocialShareButton
          key={social}
          social={social}
          url={url}
          text={text}
          onClick={() => {
            sendGTMEvent({
              event: "share",
              method: social,
            })
            onShare?.(social)
          }}
        />
      ))}
    </div>
  )
}

export interface SocialShareButtonProps {
  social: Social
  url: string
  text: string
  onClick?: () => void
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  social,
  url,
  text,
  onClick,
}) => {
  const Icon = getSocialIcon(social)

  return (
    <Hint label={social}>
      <Button
        onClick={onClick}
        variant="outline"
        className="aspect-square size-14 min-w-14"
        asChild
      >
        <Link target="_blank" rel="noreferrer" href={getShareUrl(social, url, text)}>
          {Icon}
        </Link>
      </Button>
    </Hint>
  )
}

const getSocialIcon = (social: Social) => {
  switch (social) {
    case "facebook":
      return <SiFacebook className="fill-foreground size-full" />
    case "x":
      return <SiX className="fill-foreground size-full" />
    case "whatsapp":
      return <SiWhatsapp className="fill-foreground size-full" />
    case "reddit":
      return <SiReddit className="fill-foreground size-full" />
    case "email":
      return <MailIcon className="stroke-foreground size-full" />
  }
}

const getShareUrl = (social: Social, url: string, text: string) => {
  const urlEncoded = encodeURIComponent(url)
  const textEncoded = encodeURIComponent(text)

  switch (social) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}&quote=${textEncoded}`
    case "x":
      return `https://x.com/share?text=${textEncoded}&url=${urlEncoded}`
    case "whatsapp":
      return `https://wa.me/?text=${textEncoded}%20${urlEncoded}`
    case "reddit":
      return `https://www.reddit.com/submit?url=${urlEncoded}&title=${textEncoded}`
    case "email":
      return `mailto:?subject=${textEncoded}&body=${urlEncoded}`
  }
}
