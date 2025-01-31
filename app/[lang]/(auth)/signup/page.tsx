import { SignUpForm } from "@/app/[lang]/(auth)/signup/_components/signup-form"
import { getDictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import { isUserAuthenticated } from "@/utils/user-utils"
import { redirect } from "next/navigation"

interface SignupPageProps {
  params: {
    lang: Locale
  }
}

export default async function SignupPage({ params }: SignupPageProps) {
  if (await isUserAuthenticated()) {
    redirect("/")
  }

  const authDictionary = (await getDictionary(params.lang)).page.auth

  return (
    <>
      <h2 className="text-3xl lg:text-4xl xl:text-5xl">{authDictionary.registerTitle}</h2>
      <SignUpForm lang={params.lang} authDictionary={authDictionary} />
    </>
  )
}
