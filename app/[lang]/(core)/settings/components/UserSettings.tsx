"use client"

import BaseSettingsContainer from "./BaseSettingsContainer"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { type Dictionary } from "@/get-dictionary"

interface UserSettingsProps {
  dictionary: Dictionary
}

const UserSettings: React.FC<UserSettingsProps> = ({ dictionary }) => {
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
}

export default UserSettings
