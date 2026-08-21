import { Skeleton } from "@workspace/ui/components/skeleton"
import { useTranslations } from "next-intl"
import { getLocale } from "next-intl/server"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import { GroupMembers } from "@/components/group/members/group-members"
import { redirect } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/server"

interface GroupInfoProps {
  groupId: string
  isDialog?: boolean
}

export const GroupInfo: React.FC<GroupInfoProps> = async ({ groupId, isDialog }) => {
  const supabase = await createClient()

  const { data: group } = await supabase.from("group_view").select("*").eq("id", groupId).single()
  if (!group) return redirect({ href: "/groups", locale: await getLocale() })

  return (
    <>
      <h2 className="mt-2 w-full truncate text-center text-2xl font-bold">{group.name}</h2>
      <GroupInfoHeader
        groupName={group.name ?? "Unknown"}
        iconUrl={group.icon_url ?? undefined}
        authorUid={group.created_by}
        authorUsername={group.author_username}
        authorName={group.author_name}
        createdAt={group.created_at}
      />
      <div className="bg-surface-variant/[0.28] min-h-0 w-full overflow-y-hidden rounded-2xl">
        <GroupMembers group={group} isDialog={isDialog} />
      </div>
    </>
  )
}

interface GroupInfoHeaderProps {
  groupName: string
  iconUrl?: string
  authorUid: string | null
  authorUsername: string | null
  authorName: string | null
  createdAt: string | null
}

const GroupInfoHeader: React.FC<GroupInfoHeaderProps> = ({
  groupName,
  iconUrl,
  authorUid,
  authorUsername,
  authorName,
  createdAt,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <UserAvatar size="lg" src={iconUrl} name={groupName} className="self-center" />
      <CreatedBy
        authorUid={authorUid}
        authorName={authorName}
        authorUsername={authorUsername}
        createdAt={createdAt}
      />
    </div>
  )
}

interface CreatedByProps {
  authorUid: string | null
  authorUsername: string | null
  authorName: string | null
  createdAt: string | null
}

const CreatedBy: React.FC<CreatedByProps> = ({
  authorUid,
  authorUsername,
  authorName,
  createdAt,
}) => {
  const t = useTranslations("GroupsPage.info")

  const createdAtDate = createdAt ? new Date(createdAt) : undefined
  if (!createdAtDate) {
    return <p>{t("createdAtUnknown")}</p>
  }

  if (!authorUid || !authorName || !authorUsername) {
    return <p>{t("createdByUnknown", { createdAt: createdAtDate })}</p>
  }

  return (
    <p>
      {t.rich("createdBy", {
        name: authorName,
        createdAt: createdAtDate,
        hoverCard: (chunks) => (
          <UserHoverCardWithLink uid={authorUid} username={authorUsername}>
            <b className="hover:underline">{chunks}</b>
          </UserHoverCardWithLink>
        ),
      })}
    </p>
  )
}

export const GroupInfoSkeleton: React.FC = () => {
  return (
    <>
      <Skeleton className="bg-surface-variant/[0.28] mt-2 h-8 w-1/2" />
      <div className="flex w-full flex-col gap-4 py-4">
        <Skeleton className="bg-surface-variant/[0.28] size-24 self-center rounded-full" />
        <Skeleton className="bg-surface-variant/[0.28] h-4 w-1/3" />
      </div>
      <Skeleton className="bg-surface-variant/[0.28] h-96 w-full rounded-2xl p-4" />
    </>
  )
}
