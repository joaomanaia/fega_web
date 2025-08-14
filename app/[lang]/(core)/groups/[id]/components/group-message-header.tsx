import { BackIconButton } from "@/components/back-button"
import { cn } from "@/lib/utils"
import type { GroupViewType } from "@/types/group/GroupType"
import { GroupOptionsDropdown } from "@/app/[lang]/(core)/groups/components/group-options"
import { UserAvatar, UserAvatarSkeleton } from "@/app/components/user/user-avatar"
import { Link } from "@/src/i18n/navigation"

interface GroupMessageHeaderProps {
  group: GroupViewType
  className?: string
}

export const GroupMessageHeader: React.FC<GroupMessageHeaderProps> = ({ group, className }) => {
  return (
    <div
      className={cn(
        "flex items-center w-full p-3 mb-1 rounded-[20px] bg-surface-variant",
        className
      )}
    >
      <BackIconButton className="text-surface-variant-foreground mr-2" />

      <Link href={`/groups/${group.id}/info`}>
        <UserAvatar src={group.icon_url} name={group.name} />
      </Link>

      <Link
        href={`/groups/${group.id}/info`}
        className="ml-2 grow truncate text-surface-variant-foreground"
      >
        {group.name}
      </Link>

      <GroupOptionsDropdown group={group} isOwner={group.is_owner ?? false} />
    </div>
  )
}

export const GroupMessageHeaderSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex items-center w-full p-3 mb-1 rounded-[20px] bg-surface-variant",
        className
      )}
    >
      <UserAvatarSkeleton />
    </div>
  )
}
