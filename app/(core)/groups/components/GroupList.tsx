import CreateGroupButton from "../new/components/CreateGroupButton"
import { twMerge } from "tailwind-merge"
import { GroupViewType } from "@/types/group/GroupType"
import GroupItem from "./GroupItem"
import MainContainer from "../../components/m3/MainContainer"
import { createServerComponentClient } from "@/supabase"

interface GroupListProps {
  className?: string
}

const getGroups = async (): Promise<GroupViewType[]> => {
  const supabase = createServerComponentClient()

  const { data: groups } = await supabase.from("group_view").select("*")

  return groups as GroupViewType[]
}

export default async function GroupList({ className }: GroupListProps) {
  const groups = await getGroups()

  return (
    <div className={twMerge("flex flex-col", className)}>
      <CreateGroupButton />
      <MainContainer className="h-auto w-auto flex flex-col">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} />
        ))}
      </MainContainer>
    </div>
  )
}
