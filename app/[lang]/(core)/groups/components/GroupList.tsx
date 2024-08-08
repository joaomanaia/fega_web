import type { GroupWithLastMessageViewType } from "@/types/group/GroupType"
import { GroupItem, GroupItemSkeleton } from "./GroupItem"
import { createServerComponentClient } from "@/supabase"
import { cn } from "@/lib/utils"
import { ExtendedFAB } from "@/components/ui/floating-action-button"
import Link from "next/link"
import { getLocalUserUid } from "@/utils/user-utils"
import { type Dictionary } from "@/get-dictionary"
import { Skeleton } from "@/components/ui/skeleton"
import { Locale } from "@/i18n-config"
import { MainContainer } from "@/app/components/m3/main-container"

interface GroupListProps {
  className?: string
  dictionary: Dictionary
  lang: Locale
}

const getGroupsWithLastMessage = async (): Promise<GroupWithLastMessageViewType[]> => {
  const supabase = createServerComponentClient()

  const { data: groups } = await supabase
    .from("group_with_last_message_view")
    .select("*")
    .order("last_message_at", { ascending: false })

  return groups || []
}

export default async function GroupList({ className, dictionary, lang }: GroupListProps) {
  const localUid = await getLocalUserUid()
  if (!localUid) return null

  const groups = await getGroupsWithLastMessage()

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <CreateGroupButton className="max-md:mx-3" dictionary={dictionary} />

      <MainContainer className="h-auto w-auto flex flex-col">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} localUid={localUid} lang={lang} />
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

interface GroupListSkeletonProps {
  className?: string
}

export const GroupListSkeleton: React.FC<GroupListSkeletonProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <Skeleton className="h-16 w-full rounded-[25px] bg-surfaceVariant/20" />

      <MainContainer className="h-auto w-auto flex flex-col">
        <GroupItemSkeleton />
        <GroupItemSkeleton />
        <GroupItemSkeleton />
        <GroupItemSkeleton />
        <GroupItemSkeleton />
      </MainContainer>
    </div>
  )
}
