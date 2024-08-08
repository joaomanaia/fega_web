import { createServerComponentClient } from "@/supabase"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { GroupMembers } from "@/components/group/members/group-members"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MainContainer } from "@/app/components/m3/main-container"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import { type Locale } from "@/i18n-config"

interface EditGroupPageProps {
  params: {
    lang: Locale
    id: string
  }
}

export type EditGroupFormType = "edit" | "info"

export default async function EditGroupPage({ params }: EditGroupPageProps) {
  const supabase = createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return redirect("/auth")

  const { data: group } = await supabase.from("group_view").select("*").eq("id", params.id).single()
  if (!group) return redirect("/groups")

  const groupCreatedAt = group.created_at
    ? new Date(group.created_at).toLocaleDateString()
    : "Unknown"

  return (
    <MainContainer className="w-full h-auto overflow-hidden max-md:rounded-b-none md:mb-3 flex flex-col items-center gap-4">
      <h2 className="mt-2 text-2xl font-bold truncate w-full text-center">{group.name}</h2>
      <GroupInfo
        lang={params.lang}
        groupName={group.name ?? "Group"}
        iconUrl={group.icon_url ?? undefined}
        authorUid={group.created_by}
        authorName={group.author_name}
        createdAt={groupCreatedAt}
      />
      <ScrollArea className="rounded-2xl p-4 bg-surfaceVariant/[0.28] w-full min-h-0">
        <Suspense fallback={<div>Loading members...</div>}>
          <GroupMembers group={group} />
        </Suspense>
      </ScrollArea>
    </MainContainer>
  )
}

interface GroupInfoProps {
  groupName: string
  iconUrl?: string
  authorUid: string | null
  authorName: string | null
  createdAt: string
  lang: Locale
}

const GroupInfo: React.FC<GroupInfoProps> = ({
  groupName,
  iconUrl,
  authorUid,
  authorName,
  createdAt,
  lang,
}) => {
  return (
    <div className="flex flex-col w-full gap-4 py-4">
      <UserAvatar variant="large" src={iconUrl} name={groupName} className="self-center" />
      <CreatedBy authorUid={authorUid} authorName={authorName} createdAt={createdAt} lang={lang} />
    </div>
  )
}

interface CreatedByProps {
  authorUid: string | null
  authorName: string | null
  createdAt: string
  lang: Locale
}

const CreatedBy: React.FC<CreatedByProps> = ({ authorUid, authorName, createdAt, lang }) => {
  if (!authorUid || !authorName) {
    return (
      <p>
        Created by <b>Unknown</b> on <b>{createdAt}</b>
      </p>
    )
  }

  return (
    <p>
      Created by{" "}
      <UserHoverCardWithLink lang={lang} uid={authorUid}>
        <b className="hover:underline">{authorName}</b>
      </UserHoverCardWithLink>{" "}
      on <b>{createdAt}</b>
    </p>
  )
}
