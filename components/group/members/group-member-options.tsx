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
import Link from "next/link"
import { removeParticipant } from "@/app/actions/groupActions"
import { useDictionary } from "@/hooks/use-get-dictionary"
import { useConfirm } from "@/hooks/use-confirm"
import { formatString } from "@/src/util/dictionary-util"
import { toast } from "sonner"
import { type Locale } from "@/i18n-config"

interface MemberOptionsMenuProps {
  groupId: string
  uid: string
  userName: string
  localUid: string
  isLocalAdmin: boolean
  lang: Locale
}

export const MemberOptionsMenu: React.FC<MemberOptionsMenuProps> = ({
  groupId,
  uid,
  userName,
  localUid,
  isLocalAdmin,
  lang,
}) => {
  const isLocalUser = uid === localUid
  const removeParticipantWithUid = removeParticipant.bind(null, uid, groupId)

  const dictionary = useDictionary()["groups"]["members"]["optionsMenu"]

  const [ConfirmRemoveDialog, confirmRemove] = useConfirm()

  const handleRemove = async () => {
    const confirmed = await confirmRemove()

    if (confirmed) {
      try {
        await removeParticipantWithUid()
        toast.success(formatString(dictionary.remove.onSuccess, { name: <b>{userName}</b> }))
      } catch (error) {
        toast.error(formatString(dictionary.remove.onError, { name: <b>{userName}</b> }))
      }
    }
  }

  return (
    <>
      {isLocalAdmin && !isLocalUser && (
        <ConfirmRemoveDialog
          title={dictionary.remove.dialog.title}
          message={formatString(dictionary.remove.dialog.message, { name: <b>{userName}</b> })}
          confirmText={dictionary.remove.dialog.confirm}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-inherit">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{dictionary.title}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link lang={lang} href={`/${uid}`}>
              {dictionary.viewProfile}
            </Link>
          </DropdownMenuItem>
          {!isLocalUser && <DropdownMenuItem disabled>{dictionary.message}</DropdownMenuItem>}
          {isLocalAdmin && !isLocalUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="error" onClick={handleRemove}>
                {dictionary.remove.action}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
