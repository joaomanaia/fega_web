import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from "@workspace/ui/components/avatar"

interface UserAvatarProps extends AvatarProps {
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
