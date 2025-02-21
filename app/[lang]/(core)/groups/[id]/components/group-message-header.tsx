import { BackIconButton } from "@/components/back-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { GroupViewType } from "@/types/group/GroupType"
import Link from "next/link"
import { type Locale } from "@/i18n-config"
import { type Dictionary } from "@/get-dictionary"
import { GroupOptionsDropdown } from "@/app/[lang]/(core)/groups/components/group-options"
import { UserAvatar, UserAvatarSkeleton } from "@/app/components/user/user-avatar"

interface GroupMessageHeaderProps {
  group: GroupViewType
  className?: string
  lang: Locale
  dictionary: Dictionary
}

export const GroupMessageHeader: React.FC<GroupMessageHeaderProps> = ({
  group,
  className,
  lang,
  dictionary,
}) => {
  return (
    <div
      className={cn(
        "flex items-center w-full p-3 mb-1 rounded-[20px] bg-surfaceVariant",
        className
      )}
    >
      <BackIconButton className="text-surfaceVariant-foreground mr-2" />

      <Link lang={lang} href={`/groups/${group.id}/info`}>
        <UserAvatar src={group.icon_url} name={group.name} />
      </Link>

      <Link
        lang={lang}
        href={`/groups/${group.id}/info`}
        className="ml-2 grow truncate text-surfaceVariant-foreground"
      >
        {group.name}
      </Link>

      <GroupOptionsDropdown
        group={group}
        isOwner={group.is_owner ?? false}
        lang={lang}
        dictionary={dictionary.groups.list.options}
      />
    </div>
  )
}

export const GroupMessageHeaderSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex items-center w-full p-3 mb-1 rounded-[20px] bg-surfaceVariant",
        className
      )}
    >
      <UserAvatarSkeleton />
    </div>
  )
}
