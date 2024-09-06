import { UserAvatar } from "@/app/components/user/user-avatar"
import { MemberOptionsMenu } from "@/components/group/members/group-member-options"
import { type Locale } from "@/i18n-config"


interface GroupMemberProps {
  groupId: string
  uid: string
  username: string
  fullName: string | null
  avatarUrl: string | null
  localUid: string
  isLocalAdmin: boolean
  lang: Locale
}

export const GroupMember: React.FC<GroupMemberProps> = ({
  groupId,
  uid,
  username,
  fullName,
  avatarUrl,
  localUid,
  isLocalAdmin,
  lang,
}) => {
  return (
    <li className="group flex w-full items-center py-3 first:pt-0 last:pb-5">
      <UserAvatar src={avatarUrl} name={fullName} />

      <span className="font-semibold mx-4 flex-1">{fullName}</span>

      <MemberOptionsMenu
        groupId={groupId}
        uid={uid}
        username={username}
        fullName={fullName}
        localUid={localUid}
        isLocalAdmin={isLocalAdmin}
        lang={lang}
      />
    </li>
  )
}


