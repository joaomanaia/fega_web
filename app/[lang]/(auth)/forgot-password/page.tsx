import ForgotPasswordForm from "@/app/[lang]/(auth)/forgot-password/_components/ForgotPasswordForm"
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
      <h2 className="text-3xl lg:text-4xl xl:text-5xl mb-8 w-full px-6 md:max-w-xl text-center">
        {authDictionary.forgotPasswordTitle}
      </h2>
      <ForgotPasswordForm lang={params.lang} authDictionary={authDictionary} />
    </>
  )
}
