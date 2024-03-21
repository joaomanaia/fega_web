import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export type NewsItemType = {
  id: string
  title: string
  description: string | null
  mainImage: string
}

export const NewsItem: React.FC<NewsItemType> = ({ id, title, description, mainImage }) => {
  return (
    <article
      itemScope
      itemType="https://schema.org/NewsArticle"
      className="relative bg-accent/40 p-2 lg:p-3 group rounded-2xl aspect-video w-full"
    >
      <meta itemProp="author" content="João Manaia" />

      <div className="relative w-full aspect-video">
        <meta itemProp="image" content={mainImage} />
        <Image
          className="rounded-2xl"
          src={mainImage}
          layout="fill"
          objectFit="cover"
          alt={title}
        />
      </div>

      <h4 className="font-normal text-3xl lg:text-4xl mt-4 mb-0">{title}</h4>
      <p className="text-lg mt-2 mb-2">{description}</p>

      <Button variant="tonal" className="mt-2" asChild>
        <Link href={`/news/${id}`}>Mais informações</Link>
      </Button>
    </article>
  )
}
