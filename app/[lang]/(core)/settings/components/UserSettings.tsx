"use client"

import BaseSettingsContainer from "./BaseSettingsContainer"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const UserSettings: React.FC = () => {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const signOut = async () => {
    await supabase.auth.signOut()

    router.refresh()
  }

  return (
    <BaseSettingsContainer header="User">
      <Button variant="destructive" onClick={signOut} className="w-40">
        Sign out
      </Button>
    </BaseSettingsContainer>
  )
}

export default UserSettings
