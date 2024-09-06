import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariant = cva("", {
  variants: {
    variant: {
      default: "size-10",
      large: "size-20 text-2xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type AvatarVariant = VariantProps<typeof avatarVariant>

interface UserAvatarProps extends AvatarVariant {
  src?: string | null
  name?: string | null
  alt?: string
  className?: string
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, alt, variant, className }) => {
  return (
    <Avatar className={cn(avatarVariant({ variant }), className)}>
      <AvatarImage itemProp="image" src={src ?? undefined} alt={alt} />
      <AvatarFallback>{name?.at(0)?.toUpperCase() || "?"}</AvatarFallback>
    </Avatar>
  )
}

export const UserAvatarSkeleton: React.FC = () => {
  return <Skeleton className="size-10 rounded-full bg-surfaceVariant" />
}
