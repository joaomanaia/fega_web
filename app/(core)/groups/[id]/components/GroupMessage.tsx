import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import UserType from "@/types/UserType"

type GroupMessageProps = {
  message: string
  user: UserType
  byLocalUser: boolean
  hasMessageAbove: boolean
  hasMessageBelow: boolean
}

const GroupMessage: React.FC<GroupMessageProps> = ({
  message,
  user,
  byLocalUser,
  hasMessageAbove,
  hasMessageBelow,
}) => {
  const messageCorners = (): string => {
    if (hasMessageAbove && hasMessageBelow) {
      return byLocalUser ? "rounded-r-[8px]" : "rounded-l-[8px]"
    } else if (hasMessageAbove && !hasMessageBelow) {
      return byLocalUser ? "rounded-tr-[8px]" : "rounded-tl-[8px]"
    } else if (!hasMessageAbove && hasMessageBelow) {
      return byLocalUser ? "rounded-br-[8px]" : "rounded-bl-[8px]"
    } else {
      return ""
    }
  }

  const margins = (): string => {
    if (hasMessageAbove && hasMessageBelow) {
      return "my-[2px]"
    } else if (hasMessageAbove && !hasMessageBelow) {
      return "mt-[2px] mb-2"
    } else if (!hasMessageAbove && hasMessageBelow) {
      return "mb-[2px] mt-2"
    } else {
      return "my-2"
    }
  }

  return (
    <div className="flex flex-col w-full">
      {!byLocalUser && !hasMessageAbove && (
        <div className="flex items-center space-x-2">
          <Avatar className="h-4 w-4">
            <AvatarImage src={user?.avatar_url ?? undefined} />
            <AvatarFallback>{user?.full_name}</AvatarFallback>
          </Avatar>

          <p className="my-0">{user?.full_name}</p>
        </div>
      )}

      <p
        className={cn(
          "my-0 p-3 w-fit rounded-2xl",
          byLocalUser ? "bg-primary text-primary-foreground self-end" : "border border-border self-start",
          messageCorners(),
          margins()
        )}
      >
        {message}
      </p>
    </div>
  )
}

export default GroupMessage
