import { UserAvatar } from "@/app/components/user/user-avatar"
import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import { GroupMembers } from "@/components/group/members/group-members"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/src/i18n/navigation"
import { type Locale } from "next-intl"
import { useTranslations } from "next-intl"

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
      <h2 className="mt-2 text-2xl font-bold truncate w-full text-center">{group.name}</h2>
      <GroupInfoHeader
        groupName={group.name ?? "Unknown"}
        iconUrl={group.icon_url ?? undefined}
        authorUid={group.created_by}
        authorUsername={group.author_username}
        authorName={group.author_name}
        createdAt={group.created_at}
      />
      <div className="rounded-2xl bg-surface-variant/[0.28] w-full min-h-0 overflow-y-hidden">
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
    <div className="flex flex-col w-full gap-4 py-4">
      <UserAvatar variant="large" src={iconUrl} name={groupName} className="self-center" />
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
      <Skeleton className="mt-2 w-1/2 h-8 bg-surface-variant/[0.28]" />
      <div className="flex flex-col w-full gap-4 py-4">
        <Skeleton className="self-center size-24 rounded-full bg-surface-variant/[0.28]" />
        <Skeleton className="w-1/3 h-4 bg-surface-variant/[0.28]" />
      </div>
      <Skeleton className="rounded-2xl p-4 bg-surface-variant/[0.28] w-full h-96" />
    </>
  )
}
