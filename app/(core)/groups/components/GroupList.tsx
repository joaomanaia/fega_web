import { GroupViewType } from "@/types/group/GroupType"
import { GroupItem } from "./GroupItem"
import { createServerComponentClient } from "@/supabase"
import { cn } from "@/lib/utils"
import { MainContainer } from "../../components/m3/main-container"
import { ExtendedFAB } from "@/components/ui/floating-action-button"
import Link from "next/link"

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
    <div className={cn("flex flex-col space-y-3", className)}>
      <CreateGroupButton className="max-md:mx-3" />

      <MainContainer className="h-auto w-auto flex flex-col">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} />
        ))}
      </MainContainer>
    </div>
  )
}

interface CreateGroupButtonProps {
  className?: string
}

const CreateGroupButton: React.FC<CreateGroupButtonProps> = ({ className }) => {
  return (
    <Link href="/groups/new" className={cn("next-link", className)}>
      <ExtendedFAB className="w-full">Create Group</ExtendedFAB>
    </Link>
  )
}
