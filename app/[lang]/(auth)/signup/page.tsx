import AuthPage from "@/app/[lang]/(auth)/_components/auth-page"
import { isUserAuthenticated } from "@/utils/user-utils"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { redirect } from "next/navigation"

interface SignupPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function SignupPage(props: SignupPageProps) {
  if (await isUserAuthenticated()) {
    redirect("/")
  }

  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  return <AuthPage type="signup" />
}
