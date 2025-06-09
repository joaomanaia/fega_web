import type { GroupWithLastMessageViewType } from "@/types/group/GroupType"
import { GroupListItem, GroupItemSkeleton } from "./group-list-item"
import { cn } from "@/lib/utils"
import { getLocalUserUid } from "@/utils/user-utils"
import { Skeleton } from "@/components/ui/skeleton"
import { MainContainer } from "@/app/components/m3/main-container"
import { CreateGroupButton } from "@/app/[lang]/(core)/groups/components/create-group-button"
import { UsersIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getTranslations } from "next-intl/server"

interface GroupListProps {
  className?: string
}

const getGroupsWithLastMessage = async (): Promise<GroupWithLastMessageViewType[]> => {
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from("group_with_last_message_view")
    .select("*")
    .order("last_message_at", { ascending: false })

  return groups || []
}

export default async function GroupList({ className }: GroupListProps) {
  const localUid = await getLocalUserUid()
  if (!localUid) return null

  const groups = await getGroupsWithLastMessage()
  const t = await getTranslations("GroupsPage")

  return (
    <div className={cn("w-full flex flex-col space-y-3 md:pb-3", className)}>
      <CreateGroupButton className="mx-3 md:mx-0 lg:w-full">{t("create.button")}</CreateGroupButton>

      <MainContainer className="h-full md:h-auto w-auto flex flex-col max-md:rounded-b-none">
        {groups.length ? (
          <>
            {groups.map((group) => (
              <GroupListItem key={group.id} group={group} localUid={localUid} />
            ))}
          </>
        ) : (
          <NoGroups emptyGroupsText={t("emptyGroupsPage")} />
        )}
      </MainContainer>
    </div>
  )
}

interface NoGroupsProps {
  emptyGroupsText?: string
  className?: string
}

export const NoGroups: React.FC<NoGroupsProps> = ({ className, emptyGroupsText }) => {
  return (
    <div className={cn("flex flex-col w-full h-full my-4 items-center justify-center", className)}>
      <UsersIcon className="w-16 h-16 text-secondary/50 mb-4" />
      <p className="text-body text-center text-surface-foreground/50">{emptyGroupsText}</p>
    </div>
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
