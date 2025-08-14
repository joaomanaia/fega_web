import { UsersIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateGroupButton } from "@/app/[lang]/(core)/groups/components/create-group-button"
import { MainContainer } from "@/app/components/m3/main-container"
import { verifySession } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import type { GroupWithLastMessageViewType } from "@/types/group/GroupType"
import { GroupItemSkeleton, GroupListItem } from "./group-list-item"

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
  const session = await verifySession()

  const groups = await getGroupsWithLastMessage()
  const t = await getTranslations("GroupsPage")

  return (
    <div className={cn("flex w-full flex-col space-y-3 md:pb-3", className)}>
      <CreateGroupButton className="mx-3 md:mx-0 lg:w-full">{t("create.button")}</CreateGroupButton>

      <MainContainer className="flex h-full w-auto flex-col max-md:rounded-b-none md:h-auto">
        {groups.length ? (
          <>
            {groups.map((group) => (
              <GroupListItem key={group.id} group={group} localUid={session.uid} />
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
    <div className={cn("my-4 flex h-full w-full flex-col items-center justify-center", className)}>
      <UsersIcon className="mb-4 h-16 w-16 text-secondary/50" />
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
      <Skeleton className="h-16 w-full rounded-[25px] bg-surface-variant/20" />

      <MainContainer className="flex h-auto w-auto flex-col">
        <GroupItemSkeleton />
        <GroupItemSkeleton />
        <GroupItemSkeleton />
        <GroupItemSkeleton />
        <GroupItemSkeleton />
      </MainContainer>
    </div>
  )
}
