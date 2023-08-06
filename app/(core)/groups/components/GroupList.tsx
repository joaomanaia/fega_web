import MainContainer from "@/components/m3/MainContainer"
import CreateGroupButton from "../new/components/CreateGroupButton"
import { twMerge } from "tailwind-merge"
import GroupType from "@/types/group/GroupType"
import GroupItem from "./GroupItem"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"
import { cookies } from "next/headers"

interface GroupListProps {
  className?: string
}

const getGroups = async (): Promise<GroupType[]> => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: groups } = await supabase.from("groups").select("*")

  return groups as GroupType[]
}

export default async function GroupList({ className }: GroupListProps) {
  const groups = await getGroups()

  return (
    <div className={twMerge("flex flex-col", className)}>
      <CreateGroupButton />
      <MainContainer className="h-auto w-auto flex flex-col">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} selected={false} />
        ))}
      </MainContainer>
    </div>
  )
}
