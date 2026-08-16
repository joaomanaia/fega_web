import { ExternalLinkIcon } from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { Link } from "@/i18n/navigation"

export interface OGPreviewProps {
  url: string
  title: string
  description: string
  image: string
}

export const OGPreview = ({ url, title, description, image }: OGPreviewProps) => (
  <Link href={url} target="_blank" rel="noopener noreferrer" className="block no-underline">
    <Card className="border-surface-variant/50 hover:bg-surface-variant/30 overflow-hidden transition lg:max-h-60">
      <div className="flex flex-col items-center lg:flex-row">
        <div className="p-4 lg:w-2/3">
          <h4 className="mb-2 line-clamp-2 text-lg font-semibold">{title}</h4>
          <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">{description}</p>
          <div className="text-muted-foreground flex items-center text-sm">
            <ExternalLinkIcon className="mr-1 h-4 w-4" />
            {url}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="h-40 w-full object-cover lg:h-full lg:w-1/3" />
      </div>
    </Card>
  </Link>
)
