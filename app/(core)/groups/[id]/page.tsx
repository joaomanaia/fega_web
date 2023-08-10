import { createServerComponentClient } from "@/supabase"
import { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import { redirect } from "next/navigation"
import RealtimeMessages from "./components/RealtimeMessages"
import GroupMessageForm from "./components/GroupMessageForm"
import GroupType from "@/types/group/GroupType"
import MainContainer from "../../components/m3/MainContainer"
import { getLocalUserUid } from "@/utils/user-utils"

interface GroupMessagePageProps {
  params: {
    id: string
  }
}

const getGroup = async (groupId: string): Promise<GroupType | null> => {
  const supabase = createServerComponentClient()

  const { data: group } = await supabase.from("groups").select("*").eq("id", groupId).single()

  return group ?? null
}

const getMessages = async (groupId: string): Promise<GroupMessageWithUserType[]> => {
  const supabase = createServerComponentClient()

  const { data: groupMessages } = await supabase
    .from("group_messages")
    .select("*, user:users(*)")
    .match({ group_id: groupId })
    .order("created_at")

  return groupMessages as GroupMessageWithUserType[]
}

export const dynamic = "force-dynamic"

export default async function GroupMessagePage({ params }: GroupMessagePageProps) {
  const localUserUid = await getLocalUserUid()
  if (!localUserUid) return redirect("/auth")

  const group = await getGroup(params.id)
  if (!group) return redirect("/groups")

  const messages = await getMessages(params.id)

  return (
    <MainContainer className="w-full h-auto flex flex-col items-center xl:w-4/6">
      <RealtimeMessages localUserUid={localUserUid} groupId={params.id} serverMessages={messages} />
      <GroupMessageForm group={group} />
    </MainContainer>
  )
}
