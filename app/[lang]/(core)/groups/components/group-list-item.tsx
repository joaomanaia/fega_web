"use client"

import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import {
  GroupOptionsContextMenu,
  GroupOptionsDropdown,
} from "@/app/[lang]/(core)/groups/components/group-options"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import type { GroupWithLastMessageViewType } from "@/types/group/GroupType"

type GroupListItemType = {
  group: GroupWithLastMessageViewType
  localUid: string
  className?: string
}

export const GroupListItem: React.FC<GroupListItemType> = ({ group, localUid, className }) => {
  const t = useTranslations("GroupsPage.list")
  const params = useParams()
  const selected = params?.id === group.id

  return (
    <GroupOptionsContextMenu group={group} isOwner={group.is_owner ?? false}>
      <Link
        className={cn(
          "group next-link hover:bg-surface-variant/38 flex h-fit items-center gap-4 rounded-3xl px-4 py-4 transition-colors",
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
        <div className="flex grow flex-col truncate">
          <p className="truncate text-xl font-semibold">{group.name}</p>
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

export const GroupItemSkeleton = () => (
  <div className="flex h-fit items-center gap-4 rounded-3xl px-4 py-4">
    <Skeleton className="size-10 rounded-full" />
    <div className="flex grow flex-col">
      <Skeleton className="mb-1 h-6 w-32 rounded-md" />
      <Skeleton className="h-4 w-48 rounded-md" />
    </div>
  </div>
)
