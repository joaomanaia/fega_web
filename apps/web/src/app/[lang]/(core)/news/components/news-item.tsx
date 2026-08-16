import Image from "next/image"
import { useFormatter, useNow } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Link } from "@/i18n/navigation"
import { type Tables } from "@/types/database.types"

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
        className="bg-accent/40 hover:bg-surface-variant/[0.28] relative flex aspect-video h-full w-full cursor-pointer flex-col gap-2 rounded-2xl p-2 transition-colors lg:p-3"
      >
        <meta itemProp="author" content="João Manaia" />

        <div className="relative aspect-video w-full">
          <meta itemProp="image" content={news.cover_image as string} />
          <Image
            className="rounded-2xl"
            src={news.cover_image as string}
            layout="fill"
            objectFit="cover"
            alt={news.title ?? "News Cover Image"}
          />
        </div>

        <div className="mt-2 flex items-center gap-2">
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
        <p className="text-secondary/80 text-base">{news.description}</p>
        {news.tags && (
          <ul className="flex gap-2">
            {news.tags.map((tag) => (
              <li key={tag} className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Link>
  )
}
