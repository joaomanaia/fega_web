"use client"

import { useThemeMode } from "@/core/theme/hooks/useThemeMode"
import { formatUrlWithBasePath } from "@/core/util/baseUrlUtils"
import { alpha, useTheme } from "@mui/material"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"

const AuthContent: React.FC = () => {
  const supabase = createClientComponentClient()

  const { palette } = useTheme()
  const [themeMode] = useThemeMode()

  return (
    <Auth
      supabaseClient={supabase}
      providers={["google"]}
      redirectTo={formatUrlWithBasePath("auth/callback")}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: palette.primary.light,
              brandAccent: alpha(palette.primary.light, 0.8),
              brandButtonText: palette.onPrimary.main,
            },
            radii: {
              borderRadiusButton: "999px",
              inputBorderRadius: "0.5rem",
            },
          },
          dark: {
            colors: {
              brand: palette.primary.dark,
              brandAccent: alpha(palette.primary.dark, 0.5),
              brandButtonText: palette.onPrimary.dark,
            },
          },
        },
      }}
      theme={themeMode}
    />
  )
}

export default AuthContent
