import AuthPage from "@/app/[lang]/(auth)/_components/auth-page"
import { getDictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import { isUserAuthenticated } from "@/utils/user-utils"
import { redirect } from "next/navigation"

interface LoginPageProps {
  params: {
    lang: Locale
  }
}

export default async function LoginPage({ params }: LoginPageProps) {
  if (await isUserAuthenticated()) {
    redirect("/")
  }

  const authDictionary = (await getDictionary(params.lang)).page.auth

  return <AuthPage type="forgot-password" lang={params.lang} authDictionary={authDictionary} />
}
