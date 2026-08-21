"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@workspace/ui/components/hover-card"
import { CalendarDaysIcon, Loader2 } from "lucide-react"
import { useFormatter, useNow, useTranslations } from "next-intl"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { useGetUser } from "@/features/user/use-get-user"
import { Link } from "@/i18n/navigation"

interface UserHoverCardProps {
  id: string
  children: React.ReactNode
  render?: React.ReactElement
}

export const UserHoverCard: React.FC<UserHoverCardProps> = ({ id, children, render }) => {
  return (
    <HoverCard>
      <HoverCardTrigger render={render}>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <UserHoverCardContent id={id} />
      </HoverCardContent>
    </HoverCard>
  )
}

interface UserHoverCardWithLinkProps {
  uid?: string
  username: string
  children: React.ReactNode
  className?: string
}

export const UserHoverCardWithLink: React.FC<UserHoverCardWithLinkProps> = ({
  uid,
  username,
  children,
  className,
}) => {
  return (
    <UserHoverCard
      id={uid ?? username}
      render={<Link href={`/${username}`} className={className} />}
    >
      {children}
    </UserHoverCard>
  )
}

interface UserHoverCardContent {
  id: string
}

const UserHoverCardContent = ({ id }: UserHoverCardContent) => {
  const now = useNow()
  const format = useFormatter()
  const t = useTranslations("User")
  const { data: user, isLoading, isError } = useGetUser(id)

  if (isLoading) {
    return <UserHoverCardSkeleton />
  }

  if (!user || isError) {
    return <div>User not found</div>
  }

  return (
    <div className="flex space-x-4">
      <UserAvatar src={user?.avatar_url} name={user.full_name} />
      <div className="flex flex-col self-center">
        <h4 className="text-base font-semibold">{user.full_name}</h4>
        <span className="text-foreground/60 mb-2.5 text-sm">{`@${user.username}`}</span>
        {user.bio && <p className="mb-2.5 text-sm">{user.bio}</p>}
        {user.created_at && (
          <div className="flex items-center">
            <CalendarDaysIcon className="text-foreground/80 mr-2 h-4 w-4" />
            <span className="text-foreground/80 text-xs" suppressHydrationWarning>
              {t("joinedDate", {
                joinDate: format.relativeTime(new Date(user.created_at), now),
              })}
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
      <Loader2 className="text-surface-variant size-8 animate-spin" />
    </div>
  )
}
