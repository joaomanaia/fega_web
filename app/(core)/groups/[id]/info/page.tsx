import MainContainer from "@/app/(core)/components/m3/MainContainer"
import { createServerComponentClient } from "@/supabase"
import { redirect } from "next/navigation"
import { EditGroupForm } from "./components/EditGroupForm"
import { GroupParticipants } from "./components/GroupParticipants"

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

  // No need to check if user is logged in, because it's done in the layout
  // No need to check if user is in group, because it's done in the supabase RLS
  const { data: group } = await supabase.from("group_view").select("*").eq("id", params.id).single()
  if (!group) return redirect("/groups")

  const formType: EditGroupFormType = group.is_owner ? "edit" : "info"

  return (
    <MainContainer className="w-full h-auto flex flex-col items-center xl:w-4/6">
      <h1>{group.name}</h1>
      <EditGroupForm group={group} localUid={user.id} formType={formType}>
        <GroupParticipants groupId={params.id} formType={formType} />
      </EditGroupForm>
    </MainContainer>
  )
}
