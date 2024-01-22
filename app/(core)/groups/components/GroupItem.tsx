"use client"

import { GroupViewType } from "@/types/group/GroupType"
import Link from "next/link"
import { useParams } from "next/navigation"
import { InfoGroupButtton } from "./EditGroupButton"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type GroupItemType = {
  group: GroupViewType
  className?: string
}

export const GroupItem: React.FC<GroupItemType> = ({ group, className }) => {
  const params = useParams()
  const selected = params.id === group.id

  const groupHref = `/groups/${group.id}`

  return (
    <Link
      className={cn(
        "flex items-center gap-4 h-fit px-4 py-4 next-link rounded-3xl hover:bg-surfaceVariant/[0.38] transition-colors",
        selected && "bg-primary hover:bg-primary/90 text-primary-foreground"
      )}
      href={groupHref}
    >
      <Avatar>
        <AvatarImage src={group.icon_url ?? undefined} />
        <AvatarFallback>{group.name}</AvatarFallback>
      </Avatar>
      <p className="text-xl font-semibold truncate w-full">{group.name}</p>

      {selected && <InfoGroupButtton groupHref={groupHref} isOwner={group.is_owner ?? false} />}
    </Link>
  )
}
