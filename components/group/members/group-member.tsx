import { MemberOptionsMenu } from "@/components/group/members/group-member-options"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Locale } from "@/i18n-config"


interface GroupMemberProps {
  groupId: string
  uid: string
  full_name: string
  avatar_url: string
  localUid: string
  isLocalAdmin: boolean
  lang: Locale
}

export const GroupMember: React.FC<GroupMemberProps> = ({
  groupId,
  uid,
  full_name,
  avatar_url,
  localUid,
  isLocalAdmin,
  lang,
}) => {
  return (
    <li className="group flex w-full items-center py-3 first:pt-0 last:pb-5">
      <Avatar>
        <AvatarImage src={avatar_url} />
        <AvatarFallback>{full_name}</AvatarFallback>
      </Avatar>

      <span className="font-semibold mx-4 flex-1">{full_name}</span>

      <MemberOptionsMenu
        groupId={groupId}
        uid={uid}
        userName={full_name}
        localUid={localUid}
        isLocalAdmin={isLocalAdmin}
        lang={lang}
      />
    </li>
  )
}


