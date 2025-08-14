import { getTranslations } from "next-intl/server"
import { ScrollArea } from "@/components/ui/scroll-area"
import { verifySession } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import type { GroupParticipantsViewType, GroupViewType } from "@/types/group/GroupType"
import { GroupMember } from "./group-member"
import { InviteMemberButton } from "./invite-member-button"

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

  const session = await verifySession()

  const members = await getMembers(group.id)

  const t = await getTranslations("GroupsPage.info")

  return (
    <>
      <div className="flex w-full items-center p-5 pb-0">
        <h3 className="text-xl">{t("membersNumber", { n: members.length })}</h3>

        {group.is_owner && <InviteMemberButton group={group} />}
      </div>

      <ScrollArea className="h-full max-h-full overflow-y-auto px-5">
        <ul
          className={cn(
            "flex w-full flex-col divide-y divide-surface-variant/30 pt-4",
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
              localUid={session.uid}
              isLocalAdmin={group.is_owner ?? false}
            />
          ))}
        </ul>
      </ScrollArea>
    </>
  )
}
