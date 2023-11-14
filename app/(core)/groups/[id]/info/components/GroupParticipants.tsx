import Avatar from "@/app/(core)/components/m3/avatar"
import { createServerComponentClient } from "@/supabase"
import { GroupParticipantsViewType } from "@/types/group/GroupType"
import { EditGroupFormType } from "../page"
import { AddRemoveParticipantButton } from "./AddRemoveParticipantButton"
import { getLocalUserUid } from "@/utils/user-utils"
import { ParticipantUser } from "./participants/ParticipantUser"

interface GroupParticipantsProps {
  groupId: string
  formType: EditGroupFormType
}

const getGroupParticipants = async (groupId: string): Promise<GroupParticipantsViewType[]> => {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("group_participants_view")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true })

  if (error) throw error

  return data
}

export async function GroupParticipants({ groupId, formType }: GroupParticipantsProps) {
  const localUid = await getLocalUserUid()
  if (!localUid) return null

  const participants = await getGroupParticipants(groupId)

  return (
    <>
      {participants.map((participant) => (
        <div key={participant.uid} className="flex w-full items-center my-2">
          <ParticipantUser
            uid={participant.uid ?? ""}
            full_name={participant.full_name ?? ""}
            avatar_url={participant.avatar_url ?? ""}
            type="remove"
            formType={formType}
            localUid={localUid}
          />
        </div>
      ))}
    </>
  )
}
