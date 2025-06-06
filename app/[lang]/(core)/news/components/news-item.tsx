import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/src/i18n/navigation"
import { type Tables } from "@/types/database.types"
import { useFormatter } from "next-intl"
import { useNow } from "next-intl"
import Image from "next/image"

type NewsItemType = Tables<"news_view">

interface NewsItemProps {
  news: NewsItemType
}

export const NewsItem: React.FC<NewsItemProps> = ({ news }) => {
  const now = useNow()
  const format = useFormatter()

  return (
    <Link href={`/news/${news.id}`}>
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
          {news.created_at && (
            <>
              <span>&bull;</span>
              <span className="truncate">
                {format.relativeTime(new Date(news.created_at), now)}
              </span>
            </>
          )}
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
