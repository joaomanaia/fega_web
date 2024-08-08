import { BackIconButton } from "@/components/back-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { GroupViewType } from "@/types/group/GroupType"
import { GroupOptionsDropdown } from "../../components/group-options-dropdown"
import Link from "next/link"
import { type Locale } from "@/i18n-config"

interface GroupMessageHeaderProps {
  group: GroupViewType
  className?: string
  lang: Locale
}

export const GroupMessageHeader: React.FC<GroupMessageHeaderProps> = ({
  group,
  className,
  lang,
}) => {
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

      <GroupOptionsDropdown group={group} isOwner={group.is_owner ?? false} lang={lang} />
    </div>
  )
}
