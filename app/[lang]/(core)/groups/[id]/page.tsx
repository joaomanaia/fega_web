import type { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import { redirect } from "next/navigation"
import type { GroupViewType } from "@/types/group/GroupType"
import { getLocalUserUid } from "@/utils/user-utils"
import { MainContainer } from "@/app/components/m3/main-container"
import { GroupMessageHeader } from "./components/group-message-header"
import { MessagesWithForm } from "./components/messages-with-form"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { cache } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"

interface GroupMessagePageProps {
  params: {
    lang: Locale
    id: string
  }
}

const getGroup = cache(async (groupId: string): Promise<GroupViewType | null> => {
  const supabase = await createClient()

  const { data: group } = await supabase.from("group_view").select("*").eq("id", groupId).single()

  return group ?? null
})

const getMessages = async (groupId: string): Promise<GroupMessageWithUserType[]> => {
  const supabase = await createClient()

  const { data: groupMessages } = await supabase
    .from("group_messages_view")
    .select("*")
    .match({ group_id: groupId })
    .order("created_at")
    .limit(100)

  return groupMessages as GroupMessageWithUserType[]
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: GroupMessagePageProps): Promise<Metadata> {
  const group = await getGroup(params.id)

  if (!group) return redirect("/groups")

  return {
    title: group.name,
  }
}

export default async function GroupMessagePage({ params }: GroupMessagePageProps) {
  const localUserUid = await getLocalUserUid()
  if (!localUserUid) return redirect("/login")

  const group = await getGroup(params.id)
  if (!group || !group.id || !group.name) return redirect("/groups")

  const messages = await getMessages(params.id)

  const dictionary = await getDictionary(params.lang)

  return (
    <MainContainer className="w-full h-auto max-md:rounded-b-none md:mb-3 flex flex-col items-center">
      <GroupMessageHeader
        group={group}
        lang={params.lang}
        className="xl:hidden"
        dictionary={dictionary}
      />
      <MessagesWithForm
        localUserUid={localUserUid}
        groupId={group.id}
        groupName={group.name}
        serverMessages={messages}
      />
    </MainContainer>
  )
}
