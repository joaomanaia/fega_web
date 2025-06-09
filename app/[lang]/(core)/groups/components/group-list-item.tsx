"use client"

import type { GroupWithLastMessageViewType } from "@/types/group/GroupType"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { formatString } from "@/src/util/dictionary-util"
import {
  GroupOptionsContextMenu,
  GroupOptionsDropdown,
} from "@/app/[lang]/(core)/groups/components/group-options"
import { useParams } from "next/navigation"
import { Link } from "@/src/i18n/navigation"
import { useTranslations } from "next-intl"

type GroupListItemType = {
  group: GroupWithLastMessageViewType
  localUid: string
  className?: string
}

export const GroupListItem: React.FC<GroupListItemType> = ({ group, localUid, className }) => {
  const t = useTranslations("GroupsPage.list")
  const params = useParams()
  const selected = params.id === group.id

  return (
    <GroupOptionsContextMenu group={group} isOwner={group.is_owner ?? false}>
      <Link
        className={cn(
          "group flex items-center gap-4 h-fit px-4 py-4 next-link rounded-3xl hover:bg-surfaceVariant/[0.38] transition-colors",
          selected && "bg-primary hover:bg-primary/90 text-primary-foreground",
          className
        )}
        href={`/groups/${group.id}`}
      >
        <UserAvatar
          src={group.icon_url ?? undefined}
          name={group.name}
          className={cn(selected && "bg-transparent")}
        />
        <div className="flex flex-col grow truncate">
          <p className="text-xl font-semibold truncate">{group.name}</p>
          <p className="truncate">
            {t(group.last_message_by === localUid ? "lastMessageByLocal" : "lastMessageByOther", {
              message: group.last_message ?? "",
            })}
          </p>
        </div>

        {selected && <GroupOptionsDropdown group={group} isOwner={group.is_owner ?? false} />}
      </Link>
    </GroupOptionsContextMenu>
  )
}

interface ItemContextMenuProps {
  children: React.ReactNode
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
