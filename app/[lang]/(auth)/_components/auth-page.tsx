import GoogleLoginButton from "@/app/[lang]/(auth)/_components/google-login-button"
import SocialAuthSeparator from "@/app/[lang]/(auth)/_components/social-auth-separator"
import ForgotPasswordForm from "@/app/[lang]/(auth)/forgot-password/_components/ForgotPasswordForm"
import { LoginForm } from "@/app/[lang]/(auth)/login/_components/LoginForm"
import { SignUpForm } from "@/app/[lang]/(auth)/signup/_components/signup-form"
import ResetPasswordForm from "@/components/user/reset-password-form"
import type { Dictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"

type AuthType = "login" | "signup" | "forgot-password" | "reset-password"

type AuthDictionary = Dictionary["page"]["auth"]

interface AuthPageProps {
  type: AuthType
  lang: Locale
  authDictionary: AuthDictionary
}

export default function AuthPage({ type, lang, authDictionary }: AuthPageProps) {
  return (
    <>
      <h2 className="text-3xl lg:text-4xl xl:text-5xl text-center">
        {getTitleForType(type, authDictionary)}
      </h2>
      {(type === "login" || type === "signup") && (
        <>
          <GoogleLoginButton className="w-full" authDicionary={authDictionary} />
          <SocialAuthSeparator separatorText={authDictionary.orContinueWith} />
        </>
      )}
      {type === "login" && <LoginForm lang={lang} authDictionary={authDictionary} />}
      {type === "signup" && <SignUpForm lang={lang} authDictionary={authDictionary} />}
      {type === "forgot-password" && (
        <ForgotPasswordForm lang={lang} authDictionary={authDictionary} />
      )}
      {type === "reset-password" && <ResetPasswordForm authDictionary={authDictionary} />}
    </>
  )
}

const getTitleForType = (type: AuthType, authDictionary: AuthDictionary) => {
  switch (type) {
    case "login":
      return authDictionary.loginTitle
    case "signup":
      return authDictionary.registerTitle
    case "forgot-password":
      return authDictionary.forgotPasswordTitle
    case "reset-password":
      return authDictionary.resetPassword
  }
}
