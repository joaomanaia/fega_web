import AuthPage from "@/app/[lang]/(auth)/_components/auth-page"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

interface ResetPasswordPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  return <AuthPage type="reset-password" />
}
