import { cache } from "react"
import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { MainContainer } from "@/app/components/m3/main-container"
import { verifySession } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/src/i18n/navigation"
import type { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import type { GroupViewType } from "@/types/group/GroupType"
import { GroupMessageHeader } from "./components/group-message-header"
import { MessagesWithForm } from "./components/messages-with-form"

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

export async function generateMetadata(props: PageProps<"/[lang]/groups/[id]">): Promise<Metadata> {
  const params = await props.params
  const group = await getGroup(params.id)

  if (!group) return {}

  return {
    title: group.name,
  }
}

export default async function GroupMessagePage(props: PageProps<"/[lang]/groups/[id]">) {
  const params = await props.params
  const locale = params.lang as Locale

  const session = await verifySession()

  const group = await getGroup(params.id)
  if (!group || !group.id || !group.name) return redirect({ href: "/groups", locale })

  const messages = await getMessages(params.id)

  return (
    <MainContainer className="flex h-auto w-full flex-col items-center max-md:rounded-b-none md:mb-3">
      <GroupMessageHeader group={group} className="xl:hidden" />
      <MessagesWithForm
        localUserUid={session.uid}
        groupId={group.id}
        groupName={group.name}
        serverMessages={messages}
      />
    </MainContainer>
  )
}
