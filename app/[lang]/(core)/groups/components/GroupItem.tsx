"use client"

import type { GroupWithLastMessageViewType } from "@/types/group/GroupType"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GroupOptionsDropdown } from "./group-options-dropdown"
import { Skeleton } from "@/components/ui/skeleton"
import { type Locale } from "@/i18n-config"
import { Link } from "@/components/link"

type GroupItemType = {
  group: GroupWithLastMessageViewType
  localUid: string
  className?: string
  lang: Locale
}

export const GroupItem: React.FC<GroupItemType> = ({ group, localUid, className, lang }) => {
  const params = useParams()
  const selected = params.id === group.id

  return (
    <Link
      className={cn(
        "group flex items-center gap-4 h-fit px-4 py-4 next-link rounded-3xl hover:bg-surfaceVariant/[0.38] transition-colors",
        selected && "bg-primary hover:bg-primary/90 text-primary-foreground",
        className
      )}
      lang={lang}
      href={`/groups/${group.id}`}
    >
      <Avatar className={cn(selected && "bg-transparent")}>
        <AvatarImage src={group.icon_url ?? undefined} />
        <AvatarFallback>{group.name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col grow truncate">
        <p className="text-xl font-semibold truncate">{group.name}</p>
        <p className="truncate">
          {group.last_message_by === localUid ? "You: " : ""}
          {group.last_message}
        </p>
      </div>

      {selected && (
        <GroupOptionsDropdown group={group} isOwner={group.is_owner ?? false} lang={lang} />
      )}
    </Link>
  )
}

export const GroupItemSkeleton = () => (
  <div className="flex items-center gap-4 h-fit px-4 py-4 rounded-3xl">
    <Skeleton className="size-10 rounded-full" />
    <div className="flex flex-col grow">
      <Skeleton className="w-32 h-6 mb-1 rounded-md" />
      <Skeleton className="w-48 h-4 rounded-md" />
    </div>
  </div>
)
