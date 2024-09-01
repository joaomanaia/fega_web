import { Card } from "@/components/ui/card"
import { ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

interface OGPreviewProps {
  url: string
  title: string
  description: string
  image: string
}

export const OGPreview = ({ url, title, description, image }: OGPreviewProps) => (
  <Link href={url} target="_blank" rel="noopener noreferrer" className="block no-underline">
    <Card className="overflow-hidden border-surfaceVariant/50 hover:bg-surfaceVariant/30 transition lg:max-h-60">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="lg:w-2/3 p-4">
          <h4 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <ExternalLinkIcon className="w-4 h-4 mr-1" />
            {url}
          </div>
        </div>
        <img src={image} alt={title} className="w-full lg:w-1/3 h-40 lg:h-full object-cover" />
      </div>
    </Card>
  </Link>
)
