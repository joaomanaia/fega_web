import { Avatar, AvatarFallback, AvatarImage, AvatarVariant } from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarVariant {
  src?: string | null
  name?: string | null
  alt?: string
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, alt, ...props }) => {
  return (
    <Avatar {...props}>
      <AvatarImage itemProp="image" src={src ?? undefined} alt={alt} />
      <AvatarFallback>{name?.at(0)?.toUpperCase() || "?"}</AvatarFallback>
    </Avatar>
  )
}
