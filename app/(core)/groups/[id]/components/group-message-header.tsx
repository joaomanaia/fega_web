import { BackIconButton } from "@/components/back-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { GroupViewType } from "@/types/group/GroupType"
import { GroupOptionsDropdown } from "../../components/group-options-dropdown"
import Link from "next/link"

interface GroupMessageHeaderProps {
  group: GroupViewType
  className?: string
}

export const GroupMessageHeader: React.FC<GroupMessageHeaderProps> = ({ group, className }) => {
  return (
    <div
      className={cn(
        "flex items-center w-full p-3 mb-1 rounded-[20px] bg-surfaceVariant",
        className
      )}
    >
      <BackIconButton className="text-surfaceVariant-foreground mr-2" />

      <Link href={`/groups/${group.id}/info`}>
        <Avatar>
          <AvatarImage src={group.icon_url ?? undefined} alt={group.name ?? undefined} />
          <AvatarFallback>{group.name?.at(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>

      <Link
        href={`/groups/${group.id}/info`}
        className="ml-2 grow truncate text-surfaceVariant-foreground"
      >
        <span>{group.name}</span>
      </Link>

      <GroupOptionsDropdown
        group={group}
        groupHref={`/groups/${group.id}`}
        isOwner={group.is_owner ?? false}
      />
    </div>
  )
}
