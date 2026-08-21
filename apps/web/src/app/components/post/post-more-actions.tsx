"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { deletePost } from "@/core/actions/postActions"
import { useConfirm } from "@/hooks/use-confirm"

interface PostMoreActionsProps {
  postId: string
}

const TOAST_ID = "delete-post"

export const PostMoreActions: React.FC<PostMoreActionsProps> = ({ postId }) => {
  const queryClient = useQueryClient()
  const t = useTranslations("Post.delete")

  const { execute, isPending } = useAction(deletePost, {
    onExecute: () => {
      toast.add({ type: "loading", title: "Deleting post...", id: TOAST_ID })
    },
    onSuccess: () => {
      toast.update(TOAST_ID, { type: "success", title: "Post deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: () => {
      toast.update(TOAST_ID, { type: "error", title: "Failed to delete post" })
    },
  })

  const [ConfirmRemoveDialog, confirmRemove] = useConfirm()

  const handleDeletePost = async () => {
    const ok = await confirmRemove()

    if (ok) {
      execute({ id: postId })
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
        <DropdownMenuTrigger
          disabled={isPending}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "text-surface-variant-foreground ml-auto",
          )}
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={isPending} onClick={handleDeletePost} variant="destructive">
            {t("action")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
