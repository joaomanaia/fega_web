import { LoginContainer } from "./components/LoginContainer"
import { AuthContent } from "./components/AuthContent"
import { redirect } from "next/navigation"
import { getLocalUser } from "@/utils/user-utils"
import { getDictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"

export const metadata = {
  title: "Login",
  description: "Login to use other features of the Fega app",
}

export const dynamic = "force-dynamic"

interface LoginPageProps {
  params: {
    lang: Locale
  }
}

export default async function LoginPage({ params: { lang } }: LoginPageProps) {
  const dict = await getDictionary(lang)

  const localUser = await getLocalUser()
  if (localUser) return redirect("/")

  return (
    <LoginContainer authDictionary={dict.page.auth}>
      <AuthContent locale={lang} />
    </LoginContainer>
  )
}
