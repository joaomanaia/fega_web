"use client"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
import { MoreVerticalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { removeParticipant } from "@/app/actions/groupActions"
import { useConfirm } from "@/hooks/use-confirm"
import { Link } from "@/i18n/navigation"

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
        toast.add({ title: t("remove.onSuccess", { name: fullName ?? "Unknown" }) })
      } catch {
        toast.add({ type: "error", title: t("remove.onError", { name: fullName ?? "Unknown" }) })
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
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="text-inherit" />}
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
          <DropdownMenuItem render={<Link href={`/${username}`}></Link>}>
            {t("viewProfile")}
          </DropdownMenuItem>
          {!isLocalUser && <DropdownMenuItem disabled>{t("message")}</DropdownMenuItem>}
          {isLocalAdmin && !isLocalUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleRemove}>
                {t("remove.action")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
