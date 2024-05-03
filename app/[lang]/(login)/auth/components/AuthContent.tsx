"use client"

import { type Locale } from "@/i18n-config"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useTheme } from "next-themes"
import * as pt from "./pt-auth-localization.json"

interface AuthContentProps {
  locale?: Locale
}

export const AuthContent: React.FC<AuthContentProps> = ({ locale }) => {
  const supabase = createClientComponentClient()

  const { theme } = useTheme()

  return (
    <Auth
      supabaseClient={supabase}
      providers={["google", "github", "discord"]}
      redirectTo={`${location.origin}/auth/callback`}
      localization={{
        variables: locale === "pt" ? pt : undefined,
      }}
      appearance={{
        theme: ThemeSupa,
        /*
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
        */
      }}
      theme={theme}
    />
  )
}
