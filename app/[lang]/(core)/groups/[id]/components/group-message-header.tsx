import { AvatarSkeleton } from "@/components/ui/avatar"
import { GroupOptionsDropdown } from "@/app/[lang]/(core)/groups/components/group-options"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { BackIconButton } from "@/components/back-button"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import type { GroupViewType } from "@/types/group/GroupType"

interface GroupMessageHeaderProps {
  group: GroupViewType
  className?: string
}

export const GroupMessageHeader: React.FC<GroupMessageHeaderProps> = ({ group, className }) => {
  return (
    <div
      className={cn(
        "bg-surface-variant mb-1 flex w-full items-center rounded-[20px] p-3",
        className
      )}
    >
      <BackIconButton className="text-surface-variant-foreground mr-2" />

      <Link href={`/groups/${group.id}/info`}>
        <UserAvatar src={group.icon_url} name={group.name} />
      </Link>

      <Link
        href={`/groups/${group.id}/info`}
        className="text-surface-variant-foreground ml-2 grow truncate"
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
        "bg-surface-variant mb-1 flex w-full items-center rounded-[20px] p-3",
        className
      )}
    >
      <AvatarSkeleton />
    </div>
  )
}
