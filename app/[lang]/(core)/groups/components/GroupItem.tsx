"use client"

import { type GroupViewType } from "@/types/group/GroupType"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GroupOptionsDropdown } from "./group-options-dropdown"
import { Skeleton } from "@/components/ui/skeleton"

type GroupItemType = {
  group: GroupViewType
  localUid: string
  className?: string
}

export const GroupItem: React.FC<GroupItemType> = ({ group, localUid, className }) => {
  const params = useParams()
  const selected = params.id === group.id

  const groupHref = `/groups/${group.id}`

  return (
    <Link
      className={cn(
        "flex items-center gap-4 h-fit px-4 py-4 next-link rounded-3xl hover:bg-surfaceVariant/[0.38] transition-colors",
        selected && "bg-primary hover:bg-primary/90 text-primary-foreground",
        className
      )}
      href={groupHref}
    >
      <Avatar>
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
        <GroupOptionsDropdown
          group={group}
          groupHref={groupHref}
          isOwner={group.is_owner ?? false}
        />
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
