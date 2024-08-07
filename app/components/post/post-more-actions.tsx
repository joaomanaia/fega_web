"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deletePost } from "@/core/actions/postActions"
import { useConfirm } from "@/hooks/use-confirm"
import { useDictionary } from "@/hooks/use-get-dictionary"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

interface PostMoreActionsProps {
  postId: string
}

export const PostMoreActions: React.FC<PostMoreActionsProps> = ({ postId }) => {
  const deletePostWithId = deletePost.bind(null, postId)
  const dictionary = useDictionary()["post"]

  const [ConfirmRemoveDialog, confirmRemove] = useConfirm(
    dictionary.delete.title,
    dictionary.delete.description,
    dictionary.delete.confirm
  )

  const handleDeletePost = async () => {
    const ok = await confirmRemove()

    if (ok) {
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
    }
  }

  return (
    <>
      <ConfirmRemoveDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto text-surfaceVariant-foreground">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleDeletePost}>{dictionary.delete.action}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
