"use client"

import { useRouter } from "next/navigation"
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
import { useTranslations } from "next-intl"

interface UserSettingsProps {
  user: User
}

// TODO: Add reauthentication for sensitive actions
// https://supabase.com/docs/reference/javascript/auth-reauthentication

export const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const t = useTranslations("SettingsPage.user")
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
        toast.error(t("deleteAccount.error"))
      } else {
        await supabase.auth.signOut()
        toast.success(t("deleteAccount.success"))
        router.refresh()
      }
    }
  }

  if (deletingAccount) {
    return (
      <DeletingAccountDialog
        deletingAccountTitle={t("deleteAccount.deletingAccountTitle")}
        deletingAccountDescription={t("deleteAccount.deletingAccountDescription")}
      />
    )
  }

  return (
    <>
      <SignOutConfirmDialog
        title={t("signout.confirmButton.title")}
        message={t("signout.confirmButton.message")}
      />
      <DeleteAccountConfirmDialog
        title={t("deleteAccount.dialogTitle")}
        message={t("deleteAccount.dialogDescription")}
        confirmButtonContent={t("deleteAccount.dialogSubmitButton")}
        variant="error"
        icon={UserRoundXIcon}
        inputTextToConfirm={t("deleteAccount.inputConfirmText")}
      />

      <BaseSettingsContainer header={t("header")}>
        <div className="grid grid-cols-2 gap-2.5">
          <UpdateEmailDialog currentEmail={user.email}>
            <LargeButton
              title={t("updateEmail.title")}
              description={t("updateEmail.description")}
              className="col-span-2"
            />
          </UpdateEmailDialog>

          <LargeButtonCollapsible
            disabled
            title={t("changePassword.title")}
            description={t("changePassword.description")}
            className="col-span-2"
          >
            <></>
          </LargeButtonCollapsible>

          <LargeButton
            variant="error"
            onClick={handleSignOut}
            title={t("signout.title")}
            description={t("signout.description")}
            className="text-center"
          />
          <LargeButton
            variant="error"
            onClick={handleDeleteAccount}
            title={t("deleteAccount.title")}
            description={t("deleteAccount.description")}
            className="text-center"
          />
        </div>
      </BaseSettingsContainer>
    </>
  )
}
