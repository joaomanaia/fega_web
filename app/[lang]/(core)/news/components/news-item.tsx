import { Link } from "@/components/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Locale } from "@/i18n-config"
import { type Tables } from "@/types/database.types"
import moment from "moment"
import Image from "next/image"

type NewsItemType = Tables<"news_view">

interface NewsItemProps {
  news: NewsItemType
  lang: Locale
}

function getRelativeTime(createdAt: string) {
  return moment(createdAt).fromNow()
}

export const NewsItem: React.FC<NewsItemProps> = ({ news, lang }) => {
  const relativeCreatedAt = getRelativeTime(news.created_at as string)

  return (
    <Link href={`/news/${news.id}`} lang={lang}>
      <article
        itemScope
        itemType="https://schema.org/NewsArticle"
        className="w-full h-full flex flex-col relative bg-accent/40 p-2 lg:p-3 gap-2 hover:bg-surfaceVariant/[0.28] transition-colors cursor-pointer rounded-2xl aspect-video"
      >
        <meta itemProp="author" content="João Manaia" />

        <div className="relative w-full aspect-video">
          <meta itemProp="image" content={news.cover_image as string} />
          <Image
            className="rounded-2xl"
            src={news.cover_image as string}
            layout="fill"
            objectFit="cover"
            alt={news.title ?? "News Cover Image"}
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Avatar className="size-6">
            <AvatarImage src={news.author_avatar_url ?? undefined} alt="Avatar" />
            <AvatarFallback className="text-xs">{news.author_full_name?.at(0)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{news.author_full_name}</span>
          <span>&bull;</span>
          <span className="truncate">{relativeCreatedAt}</span>
        </div>
        <h2 className="text-2xl font-bold">{news.title}</h2>
        <p className="text-base text-secondary/80">{news.description}</p>
        {news.tags && (
          <ul className="flex gap-2">
            {news.tags.map((tag) => (
              <li key={tag} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Link>
  )
}
