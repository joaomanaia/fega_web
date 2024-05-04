import { createServerComponentClient } from "@/supabase"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { GroupMembers } from "@/components/group/members/group-members"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainContainer } from "../../../../../components/m3/main-container"

interface EditGroupPageProps {
  params: {
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
    <MainContainer className="w-full h-auto overflow-hidden max-md:rounded-b-none md:mb-3 flex flex-col items-center xl:w-4/6 gap-4">
      <h2 className="text-2xl font-bold truncate w-full text-center">{group.name}</h2>
      <GroupInfo
        name={group.name ?? "Group"}
        iconUrl={group.icon_url ?? undefined}
        author={group.author_name ?? "Unknown"}
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
  name: string
  iconUrl?: string
  author: string
  createdAt: string
}

const GroupInfo: React.FC<GroupInfoProps> = ({ name, iconUrl, author, createdAt }) => {
  return (
    <div className="flex flex-col w-full gap-4 py-4">
      <Avatar className="h-20 w-20 self-center">
        <AvatarImage src={iconUrl} alt={name} />
        <AvatarFallback>{name.at(0)}</AvatarFallback>
      </Avatar>

      <p>
        Created by <span className="font-bold">{author}</span> on{" "}
        <span className="font-bold">{createdAt}</span>
      </p>
    </div>
  )
}
