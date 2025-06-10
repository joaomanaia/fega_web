import AuthPage from "@/app/[lang]/(auth)/_components/auth-page"
import { redirect } from "@/src/i18n/navigation"
import { isUserAuthenticated } from "@/utils/user-utils"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

interface LoginPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function LoginPage(props: LoginPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  if (await isUserAuthenticated()) {
    redirect({ href: "/", locale: params.lang })
  }

  return <AuthPage type="forgot-password" />
}
