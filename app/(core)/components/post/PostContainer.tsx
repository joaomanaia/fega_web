import { cn } from "@/lib/utils"

interface PostContainerProps {
  hideContainer?: boolean
  className?: string
  children: React.ReactNode
}

const PostContainer: React.FC<PostContainerProps> = ({ hideContainer, className, children }) => {
  if (hideContainer) {
    return <>{children}</>
  }

  return (
    <article className={cn("p-4 pb-2 bg-accent/30 dark:bg-accent/[0.28] rounded-3xl", className)}>{children}</article>
  )
}

export default PostContainer
