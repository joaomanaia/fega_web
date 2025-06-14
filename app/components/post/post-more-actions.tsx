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
import { useQueryClient } from "@tanstack/react-query"
import { MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

interface PostMoreActionsProps {
  postId: string
}

export const PostMoreActions: React.FC<PostMoreActionsProps> = ({ postId }) => {
  const queryClient = useQueryClient()
  const t = useTranslations("Post.delete")

  const { execute } = useServerAction(deletePost, {
    onSuccess: () => {
      toast.success("Post deleted successfully", { id: "delete-post" })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: () => {
      toast.error("Failed to delete post", { id: "delete-post" })
    },
  })

  const [ConfirmRemoveDialog, confirmRemove] = useConfirm()

  const handleDeletePost = async () => {
    const ok = await confirmRemove()

    if (ok) {
      toast.loading("Deleting post...", { id: "delete-post" })
      await execute({ id: postId })
    }
  }

  return (
    <>
      <ConfirmRemoveDialog
        title={t("title")}
        message={t("description")}
        confirmButtonContent={t("confirm")}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto text-surfaceVariant-foreground">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleDeletePost}>{t("action")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
