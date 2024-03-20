import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deletePost } from "@/core/actions/postActions"
import { MoreHorizontalIcon } from "lucide-react"
import { revalidatePath } from "next/cache"
import { toast } from "sonner"

interface PostMoreActionsProps {
  postId: string
}

export const PostMoreActions: React.FC<PostMoreActionsProps> = ({ postId }) => {
  const deletePostWithId = deletePost.bind(null, postId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto text-surfaceVariant-foreground">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async () => {
            try {
              await deletePostWithId()
              toast.success("Post deleted successfully")
            } catch (error) {
              if (error instanceof Error) {
                toast.error(error.message)
              } else {
                toast.error("Failed to delete post")
              }
            }
          }}
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
