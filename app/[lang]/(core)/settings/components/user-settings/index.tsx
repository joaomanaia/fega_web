"use client"

import { useRouter } from "next/navigation"
import { type Dictionary } from "@/get-dictionary"
import { BaseSettingsContainer } from "@/app/[lang]/(core)/settings/components/base-settings-container"
import { useConfirm } from "@/hooks/use-confirm"
import { UpdateEmailDialog } from "@/app/[lang]/(core)/settings/components/user-settings/update-email-dialog"
import { LargeButton, LargeButtonCollapsible } from "@/components/large-button"
import { UserRoundXIcon } from "lucide-react"
import { toast } from "sonner"
import { DeletingAccountDialog } from "@/app/[lang]/(core)/settings/components/user-settings/deleting-account-dialog"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type UserSettingsDictionary = Dictionary["settings"]["user"]

interface UserSettingsProps {
  user: User
  dictionary: UserSettingsDictionary
}

// TODO: Add reauthentication for sensitive actions
// https://supabase.com/docs/reference/javascript/auth-reauthentication

export const UserSettings: React.FC<UserSettingsProps> = ({ user, dictionary }) => {
  const supabase = createClient()
  const router = useRouter()

  const [SignOutConfirmDialog, confirmSignOut] = useConfirm()
  const [DeleteAccountConfirmDialog, confirmDeleteAccount] = useConfirm()

  const [deletingAccount, setDeletingAccount] = useState(false)

  const handleSignOut = async () => {
    const confirmed = await confirmSignOut()

    if (confirmed) {
      await supabase.auth.signOut()

      router.refresh()
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = await confirmDeleteAccount()

    if (confirmed) {
      setDeletingAccount(true)

      const { error } = await supabase.functions.invoke("delete-user")

      setDeletingAccount(false)

      if (error) {
        toast.error(dictionary.deleteAccount.error)
      } else {
        await supabase.auth.signOut()
        toast.success(dictionary.deleteAccount.success)
        router.refresh()
      }
    }
  }

  if (deletingAccount) {
    return (
      <>
        <DeletingAccountDialog dictionary={dictionary.deleteAccount} />
      </>
    )
  }

  return (
    <>
      <SignOutConfirmDialog
        title={dictionary.signout.confirmButton.title}
        message={dictionary.signout.confirmButton.message}
      />
      <DeleteAccountConfirmDialog
        title={dictionary.deleteAccount.dialogTitle}
        message={dictionary.deleteAccount.dialogDescription}
        confirmText={dictionary.deleteAccount.dialogSubmitButton}
        variant="error"
        icon={UserRoundXIcon}
      />

      <BaseSettingsContainer header={dictionary.header}>
        <div className="grid grid-cols-2 gap-2.5">
          <UpdateEmailDialog dictionary={dictionary.updateEmail} currentEmail={user.email}>
            <LargeButton
              title={dictionary.updateEmail.title}
              description={dictionary.updateEmail.description}
              className="col-span-2"
            />
          </UpdateEmailDialog>

          <LargeButtonCollapsible
            disabled
            title={dictionary.changePassword.title}
            description={dictionary.changePassword.description}
            className="col-span-2"
          >
            <></>
          </LargeButtonCollapsible>

          <LargeButton
            variant="error"
            onClick={handleSignOut}
            title={dictionary.signout.title}
            description={dictionary.signout.description}
            className="text-center"
          />
          <LargeButton
            variant="error"
            onClick={handleDeleteAccount}
            title={dictionary.deleteAccount.title}
            description={dictionary.deleteAccount.description}
            className="text-center"
          />
        </div>
      </BaseSettingsContainer>
    </>
  )
}
