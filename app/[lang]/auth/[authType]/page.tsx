import { use } from "react"
import { notFound } from "next/navigation"
import { useTranslations, type Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import ForgotPasswordForm from "@/app/[lang]/auth/_components/ForgotPasswordForm"
import GoogleLoginButton from "@/app/[lang]/auth/_components/google-login-button"
import { LoginForm } from "@/app/[lang]/auth/_components/LoginForm"
import { SignUpForm } from "@/app/[lang]/auth/_components/signup-form"
import SocialAuthSeparator from "@/app/[lang]/auth/_components/social-auth-separator"
import ResetPasswordForm from "@/components/user/reset-password-form"

const authTypes = ["login", "signup", "forgot-password", "reset-password"] as const
export type AuthType = (typeof authTypes)[number]

interface AuthPageProps {
  params: Promise<{
    lang: Locale
    authType: string
  }>
}

export async function generateStaticParams() {
  return authTypes.map((type) => ({
    authType: type,
  }))
}

export default function AuthPage(props: AuthPageProps) {
  const params = use(props.params)

  // Enable static rendering
  setRequestLocale(params.lang)

  const t = useTranslations("AuthPage")

  const authType = params.authType
  if (!hasAuthType(authType)) {
    return notFound()
  }

  return (
    <>
      <h2 className="text-center text-3xl lg:text-4xl xl:text-5xl">
        {t(getTitleForType(authType))}
      </h2>
      {(authType === "login" || authType === "signup") && (
        <>
          <GoogleLoginButton className="w-full" />
          <SocialAuthSeparator separatorText={t("orContinueWith")} />
        </>
      )}
      {authType === "login" && <LoginForm />}
      {authType === "signup" && <SignUpForm />}
      {authType === "forgot-password" && <ForgotPasswordForm />}
      {authType === "reset-password" && <ResetPasswordForm />}
    </>
  )
}

const getTitleForType = (type: AuthType) => {
  switch (type) {
    case "login":
      return "loginTitle"
    case "signup":
      return "registerTitle"
    case "forgot-password":
      return "forgotPasswordTitle"
    case "reset-password":
      return "resetPassword"
  }
}

const hasAuthType = (type: string): type is AuthType => {
  return authTypes.includes(type as AuthType)
}
