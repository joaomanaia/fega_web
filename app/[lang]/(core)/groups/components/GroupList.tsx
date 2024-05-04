import { type GroupViewType } from "@/types/group/GroupType"
import { GroupItem } from "./GroupItem"
import { createServerComponentClient } from "@/supabase"
import { cn } from "@/lib/utils"
import { MainContainer } from "../../../../components/m3/main-container"
import { ExtendedFAB } from "@/components/ui/floating-action-button"
import Link from "next/link"
import { getLocalUserUid } from "@/utils/user-utils"
import { type Dictionary } from "@/get-dictionary"

interface GroupListProps {
  className?: string
  dictionary: Dictionary
}

const getGroups = async (): Promise<GroupViewType[]> => {
  const supabase = createServerComponentClient()

  const { data: groups } = await supabase
    .from("group_view")
    .select("*")
    .order("last_message_at", { ascending: false })

  return groups as GroupViewType[]
}

export default async function GroupList({ className, dictionary }: GroupListProps) {
  const localUid = await getLocalUserUid()
  if (!localUid) return null

  const groups = await getGroups()

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <CreateGroupButton className="max-md:mx-3" dictionary={dictionary} />

      <MainContainer className="h-auto w-auto flex flex-col">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} localUid={localUid} />
        ))}
      </MainContainer>
    </div>
  )
}

interface CreateGroupButtonProps {
  className?: string
  dictionary: Dictionary
}

const CreateGroupButton: React.FC<CreateGroupButtonProps> = ({ className, dictionary }) => {
  return (
    <Link href="/groups/new" className={cn("next-link", className)}>
      <ExtendedFAB className="w-full">{dictionary.createGroup.button}</ExtendedFAB>
    </Link>
  )
}
