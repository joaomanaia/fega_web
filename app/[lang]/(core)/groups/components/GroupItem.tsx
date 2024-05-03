"use client"

import { GroupViewType } from "@/types/group/GroupType"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GroupOptionsDropdown } from "./group-options-dropdown"

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
        <p>
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
