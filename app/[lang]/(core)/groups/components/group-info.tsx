import { UserAvatar } from "@/app/components/user/user-avatar"
import { UserHoverCardWithLink } from "@/app/components/user/user-hover-card"
import { GroupMembers } from "@/components/group/members/group-members"
import { Skeleton } from "@/components/ui/skeleton"
import { getDictionary, type Dictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import { formatString } from "@/src/util/dictionary-util"
import { createServerComponentClient } from "@/supabase"
import { redirect } from "next/navigation"

type GroupInfoDictionary = Dictionary["groups"]["info"]

interface GroupInfoProps {
  groupId: string
  lang: Locale
  isDialog?: boolean
}

export const GroupInfo: React.FC<GroupInfoProps> = async ({ groupId, lang, isDialog }) => {
  const supabase = createServerComponentClient()

  const { data: group } = await supabase.from("group_view").select("*").eq("id", groupId).single()
  if (!group) return redirect("/groups")

  const dictionary = (await getDictionary(lang)).groups.info

  const groupCreatedAt = group.created_at
    ? new Date(group.created_at).toLocaleDateString()
    : "Unknown"

  return (
    <>
      <h2 className="mt-2 text-2xl font-bold truncate w-full text-center">{group.name}</h2>
      <GroupInfoHeader
        lang={lang}
        groupName={group.name ?? "Unknown"}
        iconUrl={group.icon_url ?? undefined}
        authorUid={group.created_by}
        authorUsername={group.author_username}
        authorName={group.author_name}
        createdAt={groupCreatedAt}
        dictionary={dictionary}
      />
      <div className="rounded-2xl bg-surfaceVariant/[0.28] w-full min-h-0 overflow-y-hidden">
        <GroupMembers group={group} lang={lang} isDialog={isDialog} dictionary={dictionary} />
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
  lang: Locale
  dictionary: GroupInfoDictionary
}

const GroupInfoHeader: React.FC<GroupInfoHeaderProps> = ({
  groupName,
  iconUrl,
  authorUid,
  authorUsername,
  authorName,
  createdAt,
  lang,
  dictionary,
}) => {
  return (
    <div className="flex flex-col w-full gap-4 py-4">
      <UserAvatar variant="large" src={iconUrl} name={groupName} className="self-center" />
      <CreatedBy
        authorUid={authorUid}
        authorName={authorName}
        authorUsername={authorUsername}
        createdAt={createdAt}
        lang={lang}
        dictionary={dictionary}
      />
    </div>
  )
}

interface CreatedByProps {
  authorUid: string | null
  authorUsername: string | null
  authorName: string | null
  createdAt: string
  lang: Locale
  dictionary: GroupInfoDictionary
}

const CreatedBy: React.FC<CreatedByProps> = ({
  authorUid,
  authorUsername,
  authorName,
  createdAt,
  lang,
  dictionary,
}) => {
  if (!authorUid || !authorName || !authorUsername) {
    return <p>{formatString(dictionary.createdByUnknown, { createdAt: createdAt })}</p>
  }

  return (
    <p>
      {formatString(dictionary.createdBy, {
        name: (
          <UserHoverCardWithLink lang={lang} uid={authorUid} username={authorUsername}>
            <b className="hover:underline">{authorName}</b>
          </UserHoverCardWithLink>
        ),
        createdAt: createdAt,
      })}
    </p>
  )
}

export const GroupInfoSkeleton: React.FC = () => {
  return (
    <>
      <Skeleton className="mt-2 w-1/2 h-8 bg-surfaceVariant/[0.28]" />
      <div className="flex flex-col w-full gap-4 py-4">
        <Skeleton className="self-center size-24 rounded-full bg-surfaceVariant/[0.28]" />
        <Skeleton className="w-1/3 h-4 bg-surfaceVariant/[0.28]" />
      </div>
      <Skeleton className="rounded-2xl p-4 bg-surfaceVariant/[0.28] w-full h-96" />
    </>
  )
}
