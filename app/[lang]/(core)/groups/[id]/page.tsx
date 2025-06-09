import type { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import type { GroupViewType } from "@/types/group/GroupType"
import { getLocalUserUid } from "@/utils/user-utils"
import { MainContainer } from "@/app/components/m3/main-container"
import { GroupMessageHeader } from "./components/group-message-header"
import { MessagesWithForm } from "./components/messages-with-form"
import { cache } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { redirect } from "@/src/i18n/navigation"

interface GroupMessagePageProps {
  params: Promise<{
    lang: Locale
    id: string
  }>
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

export async function generateMetadata(props: GroupMessagePageProps): Promise<Metadata> {
  const params = await props.params
  const group = await getGroup(params.id)

  if (!group) return {}

  return {
    title: group.name,
  }
}

export default async function GroupMessagePage(props: GroupMessagePageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  const localUserUid = await getLocalUserUid()
  if (!localUserUid) return redirect({ href: "/login", locale: params.lang })

  const group = await getGroup(params.id)
  if (!group || !group.id || !group.name) return redirect({ href: "/groups", locale: params.lang })

  const messages = await getMessages(params.id)

  return (
    <MainContainer className="w-full h-auto max-md:rounded-b-none md:mb-3 flex flex-col items-center">
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
