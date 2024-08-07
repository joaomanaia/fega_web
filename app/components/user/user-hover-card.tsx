"use client"

import { UserAvatar, UserAvatarSkeleton } from "@/app/components/user/user-avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUser } from "@/features/user/use-get-user"
import { CalendarDaysIcon } from "lucide-react"
import moment from "moment"

interface UserHoverCardProps {
  uid: string
  children: React.ReactNode
}

function getRelativeTime(createdAt: string | Date) {
  return moment(createdAt).fromNow()
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
    <div className="flex space-x-4">
      <UserAvatarSkeleton />
      <div className="flex flex-col gap-y-2 self-center">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-20 h-4 opacity-70" />
      </div>
    </div>
  )
}
