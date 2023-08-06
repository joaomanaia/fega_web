import MainContainer from "@/components/m3/MainContainer"
import MessageForm from "../../components/message/MessageForm"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"
import { cookies } from "next/headers"
import { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import GroupMessage from "./components/GroupMessage"
import { redirect } from "next/navigation"
import RealtimeMessages from "./components/RealtimeMessages"
import GroupMessageForm from "./components/GroupMessageForm"
import GroupType from "@/types/group/GroupType"

interface GroupMessagePageProps {
  params: {
    id: string
  }
}

const getLocalUserUid = async (): Promise<string | null> => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id ?? null
}

const getGroup = async (groupId: string): Promise<GroupType | null> => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: group } = await supabase.from("groups").select("*").eq("id", groupId).single()

  return group ?? null
}

const getMessages = async (groupId: string): Promise<GroupMessageWithUserType[]> => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: groupMessages } = await supabase
    .from("group_messages")
    .select("*, user:users(*)")
    .match({ group_id: groupId })
    .order("created_at")

  return groupMessages as GroupMessageWithUserType[]
}

export default async function GroupMessagePage({ params }: GroupMessagePageProps) {
  const localUserUid = await getLocalUserUid()
  if (!localUserUid) return redirect("/auth")

  const group = await getGroup(params.id)
  if (!group) return redirect("/groups")

  const messages = await getMessages(params.id)

  return (
    <MainContainer className="w-full h-auto flex flex-col items-center xl:h-auto xl:w-4/6">
      <RealtimeMessages localUserUid={localUserUid} groupId={params.id} serverMessages={messages} />
      <GroupMessageForm group={group} />
    </MainContainer>
  )
}
