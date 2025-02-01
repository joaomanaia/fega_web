import ResetPasswordForm from "@/components/user/reset-password-form"
import { getDictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import { createClient } from "@/lib/supabase/client"

interface ResetPasswordPageProps {
  params: {
    lang: Locale
  }
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const authDictionary = (await getDictionary(params.lang)).page.auth

  const client = createClient()
  const { data } = await client.auth.getUser()
  console.log(data)

  return (
    <>
      <h2 className="text-3xl lg:text-4xl xl:text-5xl w-full px-6 md:max-w-xl text-center">
        {authDictionary.resetPassword}
      </h2>
      <ResetPasswordForm authDictionary={authDictionary} />
    </>
  )
}
