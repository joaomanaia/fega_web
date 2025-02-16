import AuthPage from "@/app/[lang]/(auth)/_components/auth-page"
import { getDictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"

interface ResetPasswordPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const params = await props.params
  const authDictionary = (await getDictionary(params.lang)).page.auth

  return <AuthPage type="reset-password" lang={params.lang} authDictionary={authDictionary} />
}
