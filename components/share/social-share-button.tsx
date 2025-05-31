import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SiFacebook, SiLinkedin, SiReddit, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons"
import { sendGTMEvent } from "@next/third-parties/google"
import { MailIcon } from "lucide-react"
import Link from "next/link"

export const socialValues = ["facebook", "x", "whatsapp", "email", "reddit", "linkedin"] as const
export type Social = (typeof socialValues)[number]

interface SocialShareRowProps {
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

interface SocialShareButtonProps {
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
        className="size-14 min-w-14 aspect-square"
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
      return <SiFacebook className="size-full fill-foreground" />
    case "x":
      return <SiX className="size-full fill-foreground" />
    case "whatsapp":
      return <SiWhatsapp className="size-full fill-foreground" />
    case "reddit":
      return <SiReddit className="size-full fill-foreground" />
    case "linkedin":
      return <SiLinkedin className="size-full fill-foreground" />
    case "email":
      return <MailIcon className="size-full stroke-foreground" />
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
    case "linkedin":
      return `https://www.linkedin.com/shareArticle?mini=true&url=${urlEncoded}&text=${textEncoded}`
    case "email":
      return `mailto:?subject=${textEncoded}&body=${urlEncoded}`
  }
}
