import GoogleLoginButton from "@/app/[lang]/(auth)/_components/google-login-button"
import SocialAuthSeparator from "@/app/[lang]/(auth)/_components/social-auth-separator"
import ForgotPasswordForm from "@/app/[lang]/(auth)/forgot-password/_components/ForgotPasswordForm"
import { LoginForm } from "@/app/[lang]/(auth)/login/_components/LoginForm"
import { SignUpForm } from "@/app/[lang]/(auth)/signup/_components/signup-form"
import ResetPasswordForm from "@/components/user/reset-password-form"
import { getTranslations } from "next-intl/server"

type AuthType = "login" | "signup" | "forgot-password" | "reset-password"
interface AuthPageProps {
  type: AuthType
}

export default async function AuthPage({ type }: AuthPageProps) {
  const t = await getTranslations("AuthPage")

  return (
    <>
      <h2 className="text-3xl lg:text-4xl xl:text-5xl text-center">{t(getTitleForType(type))}</h2>
      {(type === "login" || type === "signup") && (
        <>
          <GoogleLoginButton className="w-full" />
          <SocialAuthSeparator separatorText={t("orContinueWith")} />
        </>
      )}
      {type === "login" && <LoginForm />}
      {type === "signup" && <SignUpForm />}
      {type === "forgot-password" && <ForgotPasswordForm />}
      {type === "reset-password" && <ResetPasswordForm />}
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
