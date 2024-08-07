import { createServerComponentClient } from "@/supabase"
import type { GroupParticipantsViewType, GroupViewType } from "@/types/group/GroupType"
import { getLocalUserUid } from "@/utils/user-utils"
import { GroupMember } from "./group-member"
import { InviteMemberButton } from "./invite-member-button"

const getMembers = async (groupId: string): Promise<GroupParticipantsViewType[]> => {
  const supabase = createServerComponentClient()

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
}

export async function GroupMembers({ group }: GroupMembersProps) {
  if (!group.id) return null

  const localUid = await getLocalUserUid()
  if (!localUid) return null

  const members = await getMembers(group.id)

  return (
    <>
      <div className="flex items-center w-full">
        <h3 className="text-xl">Members ({members.length})</h3>

        {group.is_owner && <InviteMemberButton group={group} />}
      </div>

      <ul className="w-full flex flex-col mt-4 divide-y divide-surfaceVariant">
        {members.map((member) => (
          <GroupMember
            key={member.uid}
            groupId={group.id!}
            uid={member.uid ?? ""}
            full_name={member.full_name ?? ""}
            avatar_url={member.avatar_url ?? ""}
            localUid={localUid}
            isLocalAdmin={group.is_owner ?? false}
          />
        ))}
      </ul>
    </>
  )
}
