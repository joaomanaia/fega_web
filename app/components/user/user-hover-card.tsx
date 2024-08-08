"use client"

import { UserAvatar } from "@/app/components/user/user-avatar"
import { Link } from "@/components/link"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useGetUser } from "@/features/user/use-get-user"
import { type Locale } from "@/i18n-config"
import { CalendarDaysIcon, Loader2 } from "lucide-react"
import moment from "moment"

function getRelativeTime(createdAt: string | Date) {
  return moment(createdAt).fromNow()
}

interface UserHoverCardProps {
  uid: string
  children: React.ReactNode
}

export const UserHoverCard: React.FC<UserHoverCardProps> = ({ uid, children }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <UserHoverCardContent uid={uid} />
      </HoverCardContent>
    </HoverCard>
  )
}

interface UserHoverCardWithLinkProps extends UserHoverCardProps {
  lang: Locale
}

export const UserHoverCardWithLink: React.FC<UserHoverCardWithLinkProps> = ({
  lang,
  uid,
  children,
}) => {
  return (
    <Link lang={lang} href={`/${uid}`}>
      <UserHoverCard uid={uid}>{children}</UserHoverCard>
    </Link>
  )
}

interface UserHoverCardContent {
  uid: string
}

const UserHoverCardContent = ({ uid }: UserHoverCardContent) => {
  const { data: user, isLoading } = useGetUser(uid)

  if (isLoading) {
    return <UserHoverCardSkeleton />
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="flex space-x-4">
      <UserAvatar src={user?.avatar_url} name={user.full_name} />
      <div className="flex flex-col gap-y-2 self-center">
        <h4 className="text-sm font-semibold">{user.full_name}</h4>
        {user.bio && <p className="text-sm mb-1">{user.bio}</p>}
        {user.created_at && (
          <div className="flex items-center">
            <CalendarDaysIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs text-muted-foreground">
              Joined {getRelativeTime(user.created_at)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const UserHoverCardSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Loader2 className="size-8 text-surfaceVariant animate-spin" />
    </div>
  )
}
