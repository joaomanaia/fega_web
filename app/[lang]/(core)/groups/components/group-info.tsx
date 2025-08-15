import { useTranslations, type Locale } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import { GroupMembers } from "@/components/group/members/group-members"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/src/i18n/navigation"

interface GroupInfoProps {
  groupId: string
  lang: Locale
  isDialog?: boolean
}

export const GroupInfo: React.FC<GroupInfoProps> = async ({ groupId, lang, isDialog }) => {
  const supabase = await createClient()

  const { data: group } = await supabase.from("group_view").select("*").eq("id", groupId).single()
  if (!group) return redirect({ href: "/groups", locale: lang })

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
  createdAt: string
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
      <UserAvatar size="large" src={iconUrl} name={groupName} className="self-center" />
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
  createdAt: string
}

const CreatedBy: React.FC<CreatedByProps> = ({
  authorUid,
  authorUsername,
  authorName,
  createdAt,
}) => {
  const t = useTranslations("GroupsPage.info")

  if (!authorUid || !authorName || !authorUsername) {
    return <p>{t("createdByUnknown", { createdAt: new Date(createdAt) })}</p>
  }

  return (
    <p>
      {t.rich("createdBy", {
        name: authorName,
        createdAt: new Date(createdAt),
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
