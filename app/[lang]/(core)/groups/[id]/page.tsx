import { createServerComponentClient } from "@/supabase"
import { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import { redirect } from "next/navigation"
import { GroupViewType } from "@/types/group/GroupType"
import { getLocalUserUid } from "@/utils/user-utils"
import { MainContainer } from "@/app/components/m3/main-container"
import { GroupMessageHeader } from "./components/group-message-header"
import { MessagesWithForm } from "./components/messages-with-form"

interface GroupMessagePageProps {
  params: {
    id: string
  }
}

const getGroup = async (groupId: string): Promise<GroupViewType | null> => {
  const supabase = createServerComponentClient()

  const { data: group } = await supabase.from("group_view").select("*").eq("id", groupId).single()

  return group ?? null
}

const getMessages = async (groupId: string): Promise<GroupMessageWithUserType[]> => {
  const supabase = createServerComponentClient()

  const { data: groupMessages } = await supabase
    .from("group_messages_view")
    .select("*")
    .match({ group_id: groupId })
    .order("created_at")
    .limit(100)

  return groupMessages as GroupMessageWithUserType[]
}

export const dynamic = "force-dynamic"

export default async function GroupMessagePage({ params }: GroupMessagePageProps) {
  const localUserUid = await getLocalUserUid()
  if (!localUserUid) return redirect("/auth")

  const group = await getGroup(params.id)
  if (!group || !group.id || !group.name) return redirect("/groups")

  const messages = await getMessages(params.id)

  return (
    <MainContainer className="w-full h-auto max-md:rounded-b-none md:mb-3 flex flex-col items-center xl:w-4/6">
      <GroupMessageHeader group={group} className="xl:hidden" />
      <MessagesWithForm
        localUserUid={localUserUid}
        groupId={group.id}
        groupName={group.name}
        serverMessages={messages}
      />
    </MainContainer>
  )
}
