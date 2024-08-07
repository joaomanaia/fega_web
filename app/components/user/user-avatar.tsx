import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { defaultImgUrl } from "@/core/common"

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  alt?: string
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, alt }) => {
  return (
    <Avatar>
      <AvatarImage itemProp="image" src={src ?? defaultImgUrl} alt={alt} />
      <AvatarFallback>{name?.at(0)?.toUpperCase() || "?"}</AvatarFallback>
    </Avatar>
  )
}

export const UserAvatarSkeleton: React.FC = () => {
  return <Skeleton className="size-10 rounded-full" />
}
