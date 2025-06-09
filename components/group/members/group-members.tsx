import type { GroupParticipantsViewType, GroupViewType } from "@/types/group/GroupType"
import { getLocalUserUid } from "@/utils/user-utils"
import { GroupMember } from "./group-member"
import { InviteMemberButton } from "./invite-member-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { getTranslations } from "next-intl/server"

const getMembers = async (groupId: string): Promise<GroupParticipantsViewType[]> => {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from("group_participants_view")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return members
}

interface GroupMembersProps {
  group: GroupViewType
  isDialog?: boolean
}

export async function GroupMembers({ group, isDialog }: GroupMembersProps) {
  if (!group.id) return null

  const localUid = await getLocalUserUid()
  if (!localUid) return null

  const members = await getMembers(group.id)

  const t = await getTranslations("GroupsPage.info")

  return (
    <>
      <div className="flex items-center w-full p-5 pb-0">
        <h3 className="text-xl">{t("membersNumber", { n: members.length })}</h3>

        {group.is_owner && <InviteMemberButton group={group} />}
      </div>

      <ScrollArea className="px-5 h-full max-h-full overflow-y-auto">
        <ul
          className={cn(
            "w-full flex flex-col pt-4 divide-y divide-surfaceVariant/30 ",
            isDialog && "max-h-[300px]"
          )}
        >
          {members.map((member) => (
            <GroupMember
              key={member.uid}
              groupId={group.id!}
              uid={member.uid!}
              username={member.username!}
              fullName={member.full_name}
              avatarUrl={member.avatar_url}
              localUid={localUid}
              isLocalAdmin={group.is_owner ?? false}
            />
          ))}
        </ul>
      </ScrollArea>
    </>
  )
}
