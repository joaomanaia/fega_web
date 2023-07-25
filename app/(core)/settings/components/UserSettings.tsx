"use client"

import { ListItemButton } from "@mui/material"
import BaseSettingsContainer from "./BaseSettingsContainer"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

const UserSettings: React.FC = () => {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const signOut = async () => {
    await supabase.auth.signOut()

    router.refresh()
  }

  return (
    <BaseSettingsContainer header="User">
      <ListItemButton onClick={signOut}>Sign out</ListItemButton>
    </BaseSettingsContainer>
  )
}

export default UserSettings
