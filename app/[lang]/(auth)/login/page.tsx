import { LoginForm } from "@/app/[lang]/(auth)/login/_components/LoginForm"
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

  return (
    <>
      <h2 className="text-3xl lg:text-4xl xl:text-5xl">{authDictionary.loginTitle}</h2>
      <LoginForm lang={params.lang} authDictionary={authDictionary} />
    </>
  )
}
