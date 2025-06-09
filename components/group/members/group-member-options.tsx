"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"
import { removeParticipant } from "@/app/actions/groupActions"
import { useConfirm } from "@/hooks/use-confirm"
import { toast } from "sonner"
import { Link } from "@/src/i18n/navigation"
import { useTranslations } from "next-intl"

interface MemberOptionsMenuProps {
  groupId: string
  uid: string
  username: string
  fullName: string | null
  localUid: string
  isLocalAdmin: boolean
}

export const MemberOptionsMenu: React.FC<MemberOptionsMenuProps> = ({
  groupId,
  uid,
  username,
  fullName,
  localUid,
  isLocalAdmin,
}) => {
  const isLocalUser = uid === localUid
  const removeParticipantWithUid = removeParticipant.bind(null, uid, groupId)

  const t = useTranslations("GroupsPage.members.optionsMenu")

  const [ConfirmRemoveDialog, confirmRemove] = useConfirm()

  const handleRemove = async () => {
    const confirmed = await confirmRemove()

    if (confirmed) {
      try {
        await removeParticipantWithUid()
        toast.success(t("remove.onSuccess", { name: fullName ?? "Unknown" }))
      } catch (error) {
        toast.error(t("remove.onError", { name: fullName ?? "Unknown" }))
      }
    }
  }

  return (
    <>
      {isLocalAdmin && !isLocalUser && (
        <ConfirmRemoveDialog
          title={t("remove.dialog.title")}
          message={t("remove.dialog.message", { name: fullName ?? "Unknown" })}
          confirmButtonContent={t("remove.dialog.confirm")}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-inherit">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/${username}`}>{t("viewProfile")}</Link>
          </DropdownMenuItem>
          {!isLocalUser && <DropdownMenuItem disabled>{t("message")}</DropdownMenuItem>}
          {isLocalAdmin && !isLocalUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="error" onClick={handleRemove}>
                {t("remove.action")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
