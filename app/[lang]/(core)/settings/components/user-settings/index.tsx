"use client"

import { createClientComponentClient, type User } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { type Dictionary } from "@/get-dictionary"
import { BaseSettingsContainer } from "@/app/[lang]/(core)/settings/components/base-settings-container"
import { useConfirm } from "@/hooks/use-confirm"
import { UpdateEmailDialog } from "@/app/[lang]/(core)/settings/components/user-settings/update-email-dialog"
import { LargeButton, LargeButtonCollapsible } from "@/components/large-button"

type UserSettingsDictionary = Dictionary["settings"]["user"]

interface UserSettingsProps {
  user: User
  dictionary: UserSettingsDictionary
}

// TODO: Add reauthentication for sensitive actions
// https://supabase.com/docs/reference/javascript/auth-reauthentication

export const UserSettings: React.FC<UserSettingsProps> = ({ user, dictionary }) => {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [SignOutConfirmDialog, confirmSignOut] = useConfirm(
    dictionary.signout.confirmButton.title,
    dictionary.signout.confirmButton.message
  )

  const handleSignOut = async () => {
    const confirmed = await confirmSignOut()

    if (confirmed) {
      await supabase.auth.signOut()

      router.refresh()
    }
  }
  return (
    <>
      <SignOutConfirmDialog />

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
            title="Change Password"
            description="Update the password for your account."
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
            disabled
            variant="error"
            onClick={handleSignOut}
            title="Delete Account"
            description="Permanently delete your account and all associated data."
            className="text-center"
          />
        </div>
      </BaseSettingsContainer>
    </>
  )
}

/* export const UserSettings: React.FC<UserSettingsProps> = ({ dictionary }) => {
    const supabase = createClientComponentClient()
    const router = useRouter()
  
    const signOut = async () => {
      await supabase.auth.signOut()
  
      router.refresh()
    }
  
    return (
      <BaseSettingsContainer header={dictionary.user}>
        <Button variant="destructive" onClick={signOut} className="w-40">
          {dictionary.signOut}
        </Button>
      </BaseSettingsContainer>
    )
  } */
