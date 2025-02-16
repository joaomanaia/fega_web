import AuthPage from "@/app/[lang]/(auth)/_components/auth-page"
import { getDictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import { isUserAuthenticated } from "@/utils/user-utils"
import { redirect } from "next/navigation"

interface LoginPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function LoginPage(props: LoginPageProps) {
  const params = await props.params
  if (await isUserAuthenticated()) {
    redirect("/")
  }

  const authDictionary = (await getDictionary(params.lang)).page.auth

  return <AuthPage type="login" lang={params.lang} authDictionary={authDictionary} />
}
